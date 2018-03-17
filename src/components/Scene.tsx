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
    // const src = this.props.images[0];
    const ctx = this.canvasRef!.getContext('2d');
    const box = this.canvasRef!.getBoundingClientRect();
    this.startEventListener();

    const { images } = this.props;
    for (let i = 0; i < images.length; i++) {
      this.imageItemArr.push(
          new ImageItem(
          ctx!,
          {x: box.left, y: box.top},
          {
            position: {x: 0, y: 0},
            shape: [{x: 150, y: 20}, {x: 30, y: 300}, {x: 150, y: 600}, {x: 0, y: 0}],
            imgSrc: images[i],
          },
        )
      );
    }

    this.imageItemArr.forEach(item => {
      item.init();
    });

    const render = () => {
      this.imageItemArr.forEach(item => {
        item.render();
      });
      requestAnimationFrame(render);
    };

    // const imageItem = new ImageItem(
    //   ctx!,
    //   {x: box.left, y: box.top},
    //   {
    //     position: {x: 0, y: 0},
    //     shape: [{x: 150, y: 20}, {x: 30, y: 300}, {x: 150, y: 600}, {x: 0, y: 0}, {x: 30, y: 30}],
    //     imgSrc: src,
    //   },
    // );
    // this.imageItem = imageItem;
    // imageItem.init();
    // const render = () => {
    //   imageItem.render();
    //   requestAnimationFrame(render);
    // };

    render();
  }

startEventListener = () => {
    if (this.canvasRef) {
      this.canvasRef.addEventListener('touchstart', (e) => {
        // if (this.imageItem) {
        //   this.imageItem.changeShape({
        //     start: {
        //       x: e.touches[0].clientX,
        //       y: e.touches[0].clientY,
        //     }
        //   });
        // }
        if (this.imageItemArr.length > 0) {
          this.imageItemArr.forEach(item => {
            item.changeShape({
                start: {
                  x: e.touches[0].clientX,
                  y: e.touches[0].clientY,
                }
            });
          });
        }
      });
      this.canvasRef.addEventListener('touchmove', (e) => {
        // if (this.imageItem) {
        //   this.imageItem.changeShape({
        //     move: {
        //       x: e.touches[0].clientX,
        //       y: e.touches[0].clientY,
        //     }
        //   });
        // }
        if (this.imageItemArr.length > 0) {
          this.imageItemArr.forEach(item => {
            item.changeShape({
                move: {
                  x: e.touches[0].clientX,
                  y: e.touches[0].clientY,
                }
            });
          });
        }
      });
      this.canvasRef.addEventListener('touchend', (e) => {
        // if (this.imageItem) {
        //   this.imageItem.changeShape({
        //     end: {
        //       x: e.changedTouches[0].clientX,
        //       y: e.changedTouches[0].clientY,
        //     }
        //   });
        // }
        if (this.imageItemArr.length > 0) {
          this.imageItemArr.forEach(item => {
            item.changeShape({
              end: {
                x: e.changedTouches[0].clientX,
                y: e.changedTouches[0].clientY,
              }
            });
          });
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