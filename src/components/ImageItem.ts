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

  private thumbtackRadius = 20;

  constructor(ctx: CanvasRenderingContext2D, canvasAxisOrigin: Position, config: ImageItemConfig) {
    this.ctx = ctx;
    this.imageConfig = config;
    this.axisOrigin = canvasAxisOrigin;
  }

  init() {
    return this.loadImage();
    // this.render();
    // this.drawClipPath();
  }

  render() {
    if (this.isLoadedImage) {
        this.drawImage();
    }
    this.drawThumbtack();
  }

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
  }

  drawClipPath() {
    const { shape } = this.imageConfig;
    if (shape && shape.length > 2) {
      this.ctx.moveTo(shape[0].x, shape[0].y);
      for (let i = 1; i < shape.length; i++) {
        const {x, y} = shape[i];
        this.ctx.lineTo(x, y);
      }
      this.ctx.lineTo(shape[0].x, shape[0].y);
      // TODO: stroke是为了开发时方便查看边界， 使用时删掉。
      this.ctx.stroke();
    }
  }

  drawImage() {
    if (this.isLoadedImage) {
      const { position } = this.imageConfig;
      if (position) {
        this.ctx.drawImage(this.image, position.x, position.y);
      } else {
        this.ctx.drawImage(this.image, 0, 0);
      }
    }
  }

  drawThumbtack() {
    const { shape } = this.imageConfig;
    shape.map((position) => {
      this.ctx.beginPath();
      this.ctx.arc(position.x, position.y, this.thumbtackRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(0,0,0,0.6)';
      this.ctx.fill();
    });
  }

  private loadImage() {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = this.imageConfig.imgSrc;
      image.onload = () => {
        this.isLoadedImage = true;
        this.image = image;
        resolve(Date.now());
      };
    });
  }

}