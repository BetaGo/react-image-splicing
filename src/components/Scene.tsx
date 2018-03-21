import * as React from 'react';
import ImageItem from './ImageItem';

export interface SceneProps {
  width: React.CSSLength;
  height: React.CSSLength; 
  images: Array<string>;
}

class Scene extends React.Component<SceneProps> {
  canvasRef: HTMLCanvasElement | null;
  imageItem: ImageItem;
  imageItemArr: Array<ImageItem> = [];

  componentDidMount() {

    const ctx = this.canvasRef!.getContext('2d');
    const box = this.canvasRef!.getBoundingClientRect();

    const { images } = this.props;
    // for (let i = 0; i < images.length; i++) {
    //   this.imageItemArr.push(
    //       new ImageItem(
    //       ctx!,
    //       {x: box.left, y: box.top},
    //       {
    //         position: {x: 0, y: 0},
    //         shape: [{x: 150, y: 20}, {x: 30, y: 300}, {x: 150, y: 600}, {x: 0, y: 0}],
    //         imgSrc: images[i],
    //       },
    //     )
    //   );
    // }

    this.imageItemArr.push(
        new ImageItem(
        ctx!,
        {x: box.left, y: box.top},
        {
          position: {x: 0, y: 0},
          shape: [{x: 20, y: 20}, {x: 280, y: 20}, {x: 280, y: 200}, {x: 20, y: 200}],
          imgSrc: images[0],
        },
      )
    );

    this.imageItemArr.push(
      new ImageItem(
      ctx!,
      {x: box.left, y: box.top},
      {
        position: {x: 0, y: 0},
        shape: [{x: 20, y: 300}, {x: 280, y: 300}, {x: 280, y: 500}, {x: 20, y: 500}],
        imgSrc: images[1],
      },
    )
  );

    this.imageItemArr.forEach(item => {
      item.init();
    });

    this.canvasRender(ctx!);

    this.startEventListener(ctx!, box);
  }

  canvasRender = (ctx: CanvasRenderingContext2D, clip = false) => {
    ctx.clearRect(0, 0, 300, 600);
    if (clip) {
      ctx.clip();
    }
    this.drawImages();
    this.drawThumbtacks();
    this.drawClipPaths(ctx);
  }

  drawClipPaths = (ctx: CanvasRenderingContext2D) => {
    if (this.imageItemArr.length > 0) {
      ctx.beginPath();
      this.imageItemArr.forEach(item => {
        item.drawClipPath();
      });
    }
  }

  drawImages = () => {
    if (this.imageItemArr.length > 0) {
      this.imageItemArr.forEach(item => {
        item.drawImage();
      });
    }
  }

  drawThumbtacks = () => {
    if (this.imageItemArr.length > 0) {
      this.imageItemArr.forEach(item => {
        item.drawThumbtack();
      });
    }
  }

  startEventListener = (ctx: CanvasRenderingContext2D, box: ClientRect | DOMRect) => {
    if (this.canvasRef) {
      this.canvasRef.addEventListener('touchstart', (e) => {
        if (this.imageItemArr.length > 0) {
          this.imageItemArr.forEach(item => {
            item.changeShape({
                start: {
                  x: e.touches[0].clientX,
                  y: e.touches[0].clientY,
                }
            });
          });
          this.canvasRender(ctx);
        }
      });
      this.canvasRef.addEventListener('touchmove', (e) => {
        if (this.imageItemArr.length > 0) {
          ctx.restore();
          this.imageItemArr.forEach(item => {
            item.changeShape({
                move: {
                  x: e.touches[0].clientX,
                  y: e.touches[0].clientY,
                }
            });
          });
          ctx.save();
          this.canvasRender(ctx, true);
        }
      });
      this.canvasRef.addEventListener('touchend', (e) => {
        if (this.imageItemArr.length > 0) {
          ctx.restore();
          this.imageItemArr.forEach(item => {
            item.changeShape({
              end: {
                x: e.changedTouches[0].clientX,
                y: e.changedTouches[0].clientY,
              }
            });
          });
          ctx.save();
          this.canvasRender(ctx, true);
        }
      });
    }
  }

  render() {
    const { width, height } = this.props;
    return (
      <canvas
        width={width}
        height={height}
        ref={ref => this.canvasRef = ref}
      />
    );
  }  
}

export default Scene;