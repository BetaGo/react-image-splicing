export type Position = {
  x: number,
  y: number,
};

export type ImageItemConfig = {
  position?: Position,
  shape?: Array<Position>,
};

export default class ImageItem {
  isLoadedImage: boolean = false;
  imgSrc: string;
  image: HTMLImageElement;
  imageConfig: ImageItemConfig;
  ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D, imgSrc: string, config: ImageItemConfig = {}) {
    this.imgSrc = imgSrc;
    this.ctx = ctx;
    this.imageConfig = config;
  }

  init() {
    this.loadImage();
    this.render();
  }

  render() {
    // tslint:disable-next-line
    // console.log('render'); 
  }

  private loadImage() {
    const image = new Image();
    image.src = this.imgSrc;
    image.onload = () => {
      this.isLoadedImage = true;
      this.image = image;

      const { position, shape } = this.imageConfig;
      if (shape && shape.length > 2) {
        this.ctx.beginPath();
        this.ctx.moveTo(shape[0].x, shape[0].y);
        for (let i = 1; i < shape.length; i++) {
          const {x, y} = shape[i];
          this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.clip();
      }
      if (position) {
        this.ctx.drawImage(this.image, position.x, position.y);
      } else {
        this.ctx.drawImage(this.image, 0, 0);
      }
    };
  }

}