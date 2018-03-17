export type Position = {
  x: number,
  y: number,
};

export type ActionPosition = {
  start?: Position,
  move?: Position,
  end?: Position,
};

export type ImageItemConfig = {
  imgSrc: string,
  position: Position,
  shape: Array<Position>,
};

export default class ImageItem {
  axisOrigin: Position;
  isLoadedImage: boolean = false;
  image: HTMLImageElement;
  imageConfig: ImageItemConfig;
  ctx: CanvasRenderingContext2D;
  movingThumbtackIndex: number | null = null; 

  // private isMoving = false;
  private thumbtackRadius = 20;

  constructor(ctx: CanvasRenderingContext2D, canvasAxisOrigin: Position, config: ImageItemConfig) {
    this.ctx = ctx;
    this.imageConfig = config;
    this.axisOrigin = canvasAxisOrigin;
  }

  init() {
    this.loadImage();
    this.render();
    // this.changeAfterSecond();
    this.clip();
  }

  render() {
    if (this.isLoadedImage) {
        this.drawImage();
    }
    this.drawThumbtack();
  }

  // changeAfterSecond() {
  //   setTimeout(
  //     () => {
  //       this.ctx.restore();
  //       this.ctx.clearRect(0, 0, 300, 600);
  //       this.imageConfig.shape = [
  //         {x: 20, y: 20},
  //         {x: 220, y: 20},
  //         {x: 220, y: 220},
  //         {x: 220, y: 220},
  //       ];
  //       this.clip();
  //       this.render();
  //     },
  //     3000,
  //   );
  // }

  changeShape(position: ActionPosition) {    
    const { start, move, end } = position;
    if (start) {
      const {x, y} = start;
      let curAxisX = x - this.axisOrigin.x;
      let curAxisY = y - this.axisOrigin.y;
      for (let i = 0; i < this.imageConfig.shape.length; i++) {
        const curThumbtack = this.imageConfig.shape[i];
        if (
          ((curAxisX - curThumbtack.x) ** 2 + (curAxisY - curThumbtack.y) ** 2) < this.thumbtackRadius ** 2
        ) {
          this.movingThumbtackIndex = i;
        }
      }
    }
    if (this.movingThumbtackIndex == null) {
      return;
    }
    this.ctx.restore();
    this.ctx.clearRect(0, 0, 300, 600);
    if (move) {
      this.imageConfig.shape[this.movingThumbtackIndex] = {
        x: move.x - this.axisOrigin.x,
        y: move.y - this.axisOrigin.y,
      };
    }
    if (end) {
      this.imageConfig.shape[this.movingThumbtackIndex] = {
        x: end.x - this.axisOrigin.x,
        y: end.y - this.axisOrigin.y,
      };
      this.movingThumbtackIndex = null;
    }

    this.clip();
  }

  private drawThumbtack() {
    const { shape } = this.imageConfig;
    shape.map((position) => {
      this.ctx.beginPath();
      this.ctx.arc(position.x, position.y, this.thumbtackRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(0,0,0,0.6)';
      this.ctx.fill();
    });
  }

  private clip() {
    const { shape } = this.imageConfig;
    if (shape && shape.length > 2) {
      this.ctx.beginPath();
      this.ctx.moveTo(shape[0].x, shape[0].y);
      for (let i = 1; i < shape.length; i++) {
        const {x, y} = shape[i];
        this.ctx.lineTo(x, y);
      }
      this.ctx.closePath();
      this.ctx.stroke();
      this.ctx.save();
      this.ctx.clip();
    }
  }

  private drawImage() {
    const { position } = this.imageConfig;
    if (position) {
      this.ctx.drawImage(this.image, position.x, position.y);
    } else {
      this.ctx.drawImage(this.image, 0, 0);
    }
  }

  private loadImage() {
    const image = new Image();
    image.src = this.imageConfig.imgSrc;
    image.onload = () => {
      this.isLoadedImage = true;
      this.image = image;
    };
  }

}