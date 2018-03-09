import * as React from 'react';
import ImageItem from './ImageItem';

export interface SceneProps {
  width: React.CSSLength;
  height: React.CSSLength; 
  images: Array<string>;
}

class Scene extends React.Component<SceneProps> {
  canvasRef: HTMLCanvasElement | null;

  componentDidMount() {
    const src = this.props.images[0];
    const ctx = this.canvasRef!.getContext('2d');
    const imageItem = new ImageItem(
      ctx!,
      src,
      {
        position: {x: 0, y: 0},
        shape: [{x: 150, y: 0}, {x: 300, y: 300}, {x: 150, y: 600}]
      },
    );
    imageItem.init();

    const render = () => {
      imageItem.render();
      requestAnimationFrame(render);
    };
    render();
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