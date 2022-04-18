import { StateManagerService } from '../../core/services/state-manager.service';

export default class DistrictTextCanvasBuilder {
  static imageHeight: number = 150;
  static imageWidth: number = 400;
  static noColor: string = 'hsla(0, 0%, 0%, 0)';
  static textColor: string = 'hsla(174, 92%, 36%, 1)';

  private static _loadFonts(): void {
    if (StateManagerService._fontLoaded) return;
  }

  private static _getTotalSize(imageWidth: number): {width: number, height: number} {
    return {
      width: imageWidth,
      height: this.imageHeight,
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

  private static _renderText(ctx: CanvasRenderingContext2D, clusterName: string): void {
    this._loadFonts();

    const fontSizePrimary = 35;

    if (clusterName.length > 20) ctx.font = '600 25px Nunito Sans';
    else if (clusterName.length > 14) ctx.font = '600 30px Nunito Sans';
    else ctx.font = `600 ${fontSizePrimary}px Nunito Sans`;
    ctx.fillStyle = this.textColor;

    const clusterNameText = ctx.measureText(clusterName.toUpperCase());

    ctx.fillText(
      clusterName.toUpperCase(),
      (this.imageWidth / 2) - (clusterNameText.width / 2),
      fontSizePrimary
    );
  }

  static build(clusterName: string): any {
    const {canvas, ctx} = this._initCanvas(this.imageWidth);

    this._renderText(ctx, clusterName);

    let type = '';
    if (window['_canIUseWebP']) type = 'image/webp';
    else type = 'image/png';

    return {
      url: canvas.toDataURL(type),
      ...this._getTotalSize(this.imageWidth)
    };
  }
}
