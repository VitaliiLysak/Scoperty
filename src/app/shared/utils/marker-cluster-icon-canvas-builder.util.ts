import FontFaceObserver from 'fontfaceobserver';

interface IStateColors {
  initial: string;
  hovered: string;
}

const multiplier: number = 2;

export default class MarkerClusterIconCanvasBuilder {

  private static _fontLoaded = false;

  static imageLeft: number = 16 * multiplier;
  static imageRight: number = 16 * multiplier;

  static imageTop: number = 16 * multiplier;
  static imageBottom: number = 32 * multiplier;
  static imageHeight: number = 40 * multiplier;

  static borderRadius: number = 2 * multiplier;

  static leftSideWidth: number = 94 * multiplier;
  static rightSideWidth: number = 118 * multiplier;

  static shadowColor: string = 'hsla(0, 0%, 57%, 0.75)';
  static shadowOffsetX: number = 0;
  static shadowOffsetY: number = 15 * multiplier;
  static shadowBlur: number = 15 * multiplier;

  // box-shadow: 0 8px 8px 0;

  static noColor: string = 'hsla(0, 0%, 0%, 0)';
  static backgroundColor: string = 'hsla(0, 0%, 100%, 1)';
  static leftSideBackgroundColor: IStateColors = {
    initial: 'hsla(174, 92%, 36%, 0.75)',
    hovered: 'hsla(174, 92%, 45%, 0.75)'
  };

  static leftSideTextColor: string = 'hsla(0, 0%, 100%, 1)';
  static rightSideTextColor: string = 'hsla(185, 71%, 47%, 1)';

  private static async _loadFonts(): Promise<void> {
    if (this._fontLoaded) return;

    try {
      await Promise.all([
        new FontFaceObserver('Nunito Sans', {weight: 200}).load(),
        new FontFaceObserver('Nunito Sans', {weight: 300}).load(),
      ]);
    } catch (error) {
      console.error('MarkerClusterIconCanvasBuilder::_loadFonts', error);
      return;
    }

    this._fontLoaded = true;
  }

  private static _getTotalSize(imageWidth: number): {width: number, height: number} {
    return {
      width: this.imageLeft + imageWidth + this.imageRight,
      height: this.imageTop + this.imageHeight + this.imageBottom,
    };
  }

  private static _initCanvas(imageWidth: number): {canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D} {
    const canvas = document.createElement('canvas');
    const size = this._getTotalSize(imageWidth);

    canvas.width = size.width;
    canvas.height = size.height;
    canvas.style.background = this.noColor;

    const ctx = canvas.getContext('2d');

    return {canvas, ctx};
  }

  private static _drawBackground(ctx: CanvasRenderingContext2D, imageWidth: number): void {
    // Configure shadow
    ctx.shadowColor = this.shadowColor;
    ctx.shadowOffsetX = this.shadowOffsetX;
    ctx.shadowOffsetY = this.shadowOffsetY;
    ctx.shadowBlur = this.shadowBlur;
    ctx.fillStyle = this.backgroundColor;

    ctx.beginPath();
    ctx.moveTo(
      this.imageLeft,
      this.imageTop + this.borderRadius * 2
    );
    ctx.arcTo(
      this.imageLeft,
      this.imageTop,
      this.imageLeft + this.borderRadius * 2,
      this.imageTop, this.borderRadius
    );
    ctx.lineTo(
      this.imageLeft + imageWidth - this.borderRadius * 2,
      this.imageTop
    );
    ctx.arcTo(
      this.imageLeft + imageWidth,
      this.imageTop,
      this.imageLeft + imageWidth,
      this.imageTop + this.borderRadius * 2,
      this.borderRadius
    );
    ctx.lineTo(
      this.imageLeft + imageWidth,
      this.imageHeight - this.borderRadius * 2
    );
    ctx.arcTo(
      this.imageLeft + imageWidth,
      this.imageTop + this.imageHeight,
      this.imageLeft + imageWidth - this.borderRadius * 2,
      this.imageTop + this.imageHeight,
      this.borderRadius
    );
    ctx.lineTo(
      this.imageLeft + this.borderRadius * 2,
      this.imageTop + this.imageHeight
    );
    ctx.arcTo(
      this.imageLeft,
      this.imageTop + this.imageHeight,
      this.imageLeft,
      this.imageTop + this.imageHeight - this.borderRadius * 2,
      this.borderRadius
    );
    ctx.lineTo(
      this.imageLeft,
      this.imageTop + this.borderRadius * 2
    );
    ctx.closePath();
    ctx.fill();

    // Reset shadow
    ctx.shadowColor = this.noColor;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 0;
  }

  private static _drawLeftSide(ctx: CanvasRenderingContext2D, roundRightCorners: boolean = false, state: string): void {
    ctx.fillStyle = this.leftSideBackgroundColor[state];
    ctx.beginPath();
    ctx.moveTo(
      this.imageLeft,
      this.imageTop + this.borderRadius * 2
    );
    ctx.arcTo(
      this.imageLeft,
      this.imageTop,
      this.imageLeft + this.borderRadius * 2,
      this.imageTop,
      this.borderRadius
    );
    if (roundRightCorners) {
      ctx.lineTo(
        this.imageLeft + this.leftSideWidth - this.borderRadius * 2,
        this.imageTop
      );
      ctx.arcTo(
        this.imageLeft + this.leftSideWidth,
        this.imageTop,
        this.imageLeft + this.leftSideWidth,
        this.imageTop + this.borderRadius * 2,
        this.borderRadius
      );
      ctx.lineTo(
        this.imageLeft + this.leftSideWidth,
        this.imageTop + this.imageHeight - this.borderRadius * 2
      );
      ctx.arcTo(
        this.imageLeft + this.leftSideWidth,
        this.imageTop + this.imageHeight,
        this.imageLeft + this.leftSideWidth - this.borderRadius * 2,
        this.imageTop + this.imageHeight,
        this.borderRadius
      );
    } else {
      ctx.lineTo(
        this.imageLeft + this.leftSideWidth,
        this.imageTop
      );
      ctx.lineTo(
        this.imageLeft + this.leftSideWidth,
        this.imageTop + this.imageHeight
      );
    }
    ctx.lineTo(
      this.imageLeft + this.borderRadius * 2,
      this.imageTop + this.imageHeight
    );
    ctx.arcTo(
      this.imageLeft,
      this.imageTop + this.imageHeight,
      this.imageLeft,
      this.imageTop + this.imageHeight - this.borderRadius * 2,
      this.borderRadius
    );
    ctx.lineTo(
      this.imageLeft,
      this.imageTop + this.borderRadius * 2
    );
    ctx.closePath();
    ctx.fill();
  }

  private static async _renderText(ctx: CanvasRenderingContext2D, clusterName: string, clusterSize: string, label: string): Promise<void> {
    await this._loadFonts();

    const fontSizePrimary = 16 * multiplier;
    const fontSizeSecondary = 12 * multiplier;

    ctx.fillStyle = this.leftSideTextColor;
    ctx.font = `300 ${fontSizePrimary}px Nunito Sans`;
    clusterSize = clusterSize.split('').join(String.fromCharCode(8202));

    const clusterSizeText = ctx.measureText(clusterSize);

    ctx.fillText(
      clusterSize,
      this.imageLeft + this.leftSideWidth / 2 - clusterSizeText.width / 2,
      this.imageTop + fontSizePrimary + fontSizePrimary / 5
    );

    ctx.fillStyle = this.leftSideTextColor;
    ctx.font = `100 ${fontSizeSecondary}px Nunito Sans`;
    label = label.split('').join(String.fromCharCode(8202));

    const labelText = ctx.measureText(label);

    ctx.fillText(
      label,
      this.imageLeft + this.leftSideWidth / 2 - labelText.width / 2,
      this.imageTop + fontSizePrimary + fontSizePrimary / 5 + fontSizeSecondary
    );

    if (clusterName == null) return;

    if (clusterName.length > 20) ctx.font = '300 24px Nunito Sans';
    else if (clusterName.length > 14) ctx.font = '300 27px Nunito Sans';
    else ctx.font = `300 ${fontSizePrimary}px Nunito Sans`;
    ctx.fillStyle = this.rightSideTextColor;

    const clusterNameText = ctx.measureText(clusterName);

    ctx.fillText(
      clusterName,
      this.imageLeft + this.leftSideWidth + this.rightSideWidth / 2 - clusterNameText.width / 2,
      this.imageTop + this.imageHeight / 2 + fontSizePrimary / 3
    );
  }

  static async build(
    clusterName: string,
    state: string,
    {count: clusterSize, label}: any,
    needRenderName: boolean = true
  ): Promise<{url: string, width: number, height: number}> {
    const imageWidth = this.leftSideWidth + (needRenderName && this.rightSideWidth);
    const {canvas, ctx} = this._initCanvas(imageWidth);

    await this._drawBackground(ctx, imageWidth);
    await this._drawLeftSide(ctx, !needRenderName, state);
    await this._renderText(ctx, needRenderName ? clusterName : null, clusterSize, 'Immobilien');

    let type: string = '';
    if (window['_canIUseWebP']) type = 'image/webp';
    else type = 'image/png';

    return {
      url: await canvas.toDataURL(type, 0.7),
      ...this._getTotalSize(imageWidth)
    };
  }
}
