import FontFaceObserver from 'fontfaceobserver';
import { StateManagerService } from '../../core/services/state-manager.service';
import { StyleGuide } from '../../styles/style-guide';

interface ColorKit {
  selected: string;
  Active: string;
  NotActiveYet: string;
  ForSale: string;
  MakeMeMove: string;
  Idle: string;
}

const multiplier: number = 8;

export default class MarkerIconCanvasBuilder {

  private static _fontLoaded = false;

  static imageLeft: number = 0 * multiplier;
  static imageRight: number = 0 * multiplier;
  static imageTop: number = 0 * multiplier;
  static imageBottom: number = 0 * multiplier;
  static imageHeight: number = 16 * multiplier;
  static imageActiveHeight: number = 24 * multiplier;
  static borderRadius: number = 2 * multiplier;

  static leftSideWidth: number = 16 * multiplier;
  static activeLeftSideWidth: number = 24 * multiplier;
  static rightSideWidth: number = 100 * multiplier;

  static shadowColor: string = 'hsla(0, 0%, 28%, 0.11)';
  static shadowOffsetX: number = 0;
  static shadowOffsetY: number = 4 * multiplier;
  static shadowBlur: number = 4 * multiplier;

  static noColor: string = 'hsla(0, 0%, 0%, 0)';
  static backgroundColor: ColorKit = {
    selected: 'hsl(207, 96%, 56%)',
    Active: 'hsl(0, 0%, 100%)',
    NotActiveYet: 'hsl(0, 0%, 100%)',
    ForSale: 'hsl(0, 0%, 100%)',
    MakeMeMove: 'hsl(0, 0%, 100%)',
    Idle: 'hsl(0, 0%, 100%)'
  };
  static leftSideBackgroundColor: ColorKit = {
    selected: 'hsla(0, 0%, 100%, 0.7)',
    Active: 'hsl(174, 92%, 36%)',
    NotActiveYet: 'hsl(174, 92%, 36%)',
    ForSale: 'hsl(306, 83%, 43%)',
    MakeMeMove: 'hsl(214, 100%, 34%)',
    Idle: 'hsl(0, 1%, 64%)'
  };

  static textColor: string = StyleGuide.primaryCTADefaultColor;
  static activeTextColor: string = StyleGuide.neutralsWhiteColor;

  // private async static _loadFonts(): Promise<void> {
  //   if (this._fontLoaded) return;

  //   try {
  //     await Promise.all([
  //       new FontFaceObserver('Nunito Sans', {weight: 400}).load()
  //     ])
  //   } catch (error) {
  //     console.error('MarkerIconCanvasBuilder::_loadFonts', error);
  //     return;
  //   }

  //   this._fontLoaded = true;
  // }
  private static _loadFonts(): void {
    if (StateManagerService._fontLoaded) return;

    try {
      Promise.all([
        new FontFaceObserver('Nunito Sans', {weight: 400}).load()
      ]).then(f => this._fontLoaded = true);
    } catch (error) {
      console.error('MarkerIconCanvasBuilder::_loadFonts', error);
      return;
    }

    // this._fontLoaded = true;
  }

  private static _getTotalSize(imageWidth: number, isActive: boolean): {width: number, height: number} {
    const imageHeight = isActive ? this.imageActiveHeight : this.imageHeight;
    return {
      width: this.imageLeft + imageWidth + this.imageRight,
      height: this.imageTop + imageHeight + this.imageBottom,
    };
  }

  private static _initCanvas(imageWidth: number, isActive: boolean): {canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D} {
    const canvas = document.createElement('canvas');
    const size = this._getTotalSize(imageWidth, isActive);

    canvas.width = size.width;
    canvas.height = size.height;

    canvas.style.background = this.noColor;
    canvas.style.letterSpacing = '.4px';
    (canvas.style as any).webkitFontSmoothing = 'antialiased';

    const ctx = canvas.getContext('2d');

    return {canvas, ctx};
  }

  private static _drawBackground(ctx: CanvasRenderingContext2D, imageWidth: number, isActive: boolean, style: any): void {
    // Configure shadow
    ctx.fillStyle = isActive ? this.getLinearGradientColor(ctx, style, 124, 24) : this.backgroundColor[style];
    const imageHeight = isActive ? this.imageActiveHeight : this.imageHeight;
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
      imageHeight - this.borderRadius * 2
    );
    ctx.arcTo(
      this.imageLeft + imageWidth,
      this.imageTop + imageHeight,
      this.imageLeft + imageWidth - this.borderRadius * 2,
      this.imageTop + imageHeight,
      this.borderRadius
    );
    ctx.lineTo(
      this.imageLeft + this.borderRadius * 2,
      this.imageTop + imageHeight
    );
    ctx.arcTo(
      this.imageLeft,
      this.imageTop + imageHeight,
      this.imageLeft,
      this.imageTop + imageHeight - this.borderRadius * 2,
      this.borderRadius
    );
    ctx.lineTo(
      this.imageLeft,
      this.imageTop + this.borderRadius * 2
    );
    ctx.closePath();
    ctx.fill();
  }

  private static getLinearGradientColor(ctx: CanvasRenderingContext2D, style: any, imageWidth: number, imageHeight: number) {
    ctx.rect(0, 0, imageWidth, imageHeight);
    const grd = ctx.createLinearGradient(imageWidth, 0, imageWidth, imageHeight);
    if (style === 'Idle') {
      grd.addColorStop(0, 'hsl(0, 1%, 82%)');
      grd.addColorStop(1, 'hsl(0, 1%, 64%)');
    } else if (style === 'ForSale') {
      grd.addColorStop(0, 'hsl(304, 79%, 53%)');
      grd.addColorStop(1, 'hsl(306, 83%, 43%)');
    } else if (style === 'MakeMeMove') {
      grd.addColorStop(0, 'hsl(204, 100%, 42%)');
      grd.addColorStop(1, 'hsl(214, 100%, 34%)');
    } else {
      grd.addColorStop(0, 'hsl(198, 95%, 68%)');
      grd.addColorStop(1, 'hsl(174, 92%, 36%)');
    }

    return grd;
  }

  private static _drawLeftSide(ctx: CanvasRenderingContext2D, style: any): void {
    ctx.fillStyle = style === 'selected' ? this.leftSideBackgroundColor[style] : this.getLinearGradientColor(ctx, style, 16, 16);
    ctx.beginPath();
    const leftSideWidth = style === 'selected' ? this.activeLeftSideWidth : this.leftSideWidth;
    const imageHeight = style === 'selected' ? this.imageActiveHeight : this.imageHeight;
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
    ctx.lineTo(
      this.imageLeft + leftSideWidth - this.borderRadius * 2,
      this.imageTop
    );
    ctx.arcTo(
      this.imageLeft + leftSideWidth,
      this.imageTop,
      this.imageLeft + leftSideWidth,
      this.imageTop + this.borderRadius * 2,
      this.borderRadius
    );
    ctx.lineTo(
      this.imageLeft + leftSideWidth,
      this.imageTop + imageHeight - this.borderRadius * 2
    );
    ctx.arcTo(
      this.imageLeft + leftSideWidth,
      this.imageTop + imageHeight,
      this.imageLeft + leftSideWidth - this.borderRadius * 2,
      this.imageTop + imageHeight,
      this.borderRadius
    );
    ctx.lineTo(
      this.imageLeft + this.borderRadius * 2,
      this.imageTop + imageHeight
    );
    ctx.arcTo(
      this.imageLeft,
      this.imageTop + imageHeight,
      this.imageLeft,
      this.imageTop + imageHeight - this.borderRadius * 2,
      this.borderRadius
    );
    ctx.lineTo(
      this.imageLeft,
      this.imageTop + this.borderRadius * 2
    );
    ctx.closePath();
    ctx.fill();
  }

  private static _drawImage(ctx: CanvasRenderingContext2D, source: any, isActive: boolean): void {
    const shiftValue = isActive ? 0 : -2;
    ctx.drawImage(source, shiftValue * multiplier, shiftValue * multiplier, source.width * multiplier, source.height * multiplier);
  }

  private static _renderText(ctx: CanvasRenderingContext2D, label: string, isActive: boolean, status: string): void {
    this._loadFonts();
    const imageHeight = isActive ? this.imageActiveHeight : this.imageHeight;
    const leftSideWidth = isActive ? this.activeLeftSideWidth : this.leftSideWidth;
    const fontSizePrimary = 10 * multiplier;

    ctx.fillStyle = isActive ? this.activeTextColor : this.textColor;
    ctx.font = `400 ${fontSizePrimary}px Nunito Sans`;
    const labelText = ctx.measureText(label);
    ctx.fillText(
      label,
      this.imageLeft + leftSideWidth + this.rightSideWidth / 2 - labelText.width / 2,
      this.imageTop + imageHeight / 2 + fontSizePrimary / 3
    );
  }
  // private static async _renderText(ctx: CanvasRenderingContext2D, label: string, isActive: boolean, status: string): Promise<void> {
  //   await this._loadFonts();
  //   const imageHeight = isActive ? this.imageActiveHeight : this.imageHeight;
  //   const leftSideWidth = isActive ? this.activeLeftSideWidth : this.leftSideWidth;
  //   const fontSizePrimary = 10 * multiplier;

  //   ctx.fillStyle = isActive ? this.activeTextColor : this.leftSideBackgroundColor[status];
  //   ctx.font = `400 ${fontSizePrimary}px Nunito Sans`;
  //   const labelText = ctx.measureText(label);
  //   ctx.fillText(
  //     label,
  //     this.imageLeft + leftSideWidth + this.rightSideWidth / 2 - labelText.width / 2,
  //     this.imageTop + imageHeight / 2 + fontSizePrimary / 3
  //   );
  // }

  static build(label: string, status, isActive, imageLogo): {url: string, width: number, height: number, multiplier: number} {
    const leftSideWidth = isActive ? this.activeLeftSideWidth : this.leftSideWidth;
    const imageWidth = leftSideWidth + this.rightSideWidth;

    if ((window as any).markerIcons == null) (window as any).markerIcons = {};

    const {canvas, ctx} = this._initCanvas(imageWidth, isActive);

    this._drawBackground(ctx, imageWidth, isActive, status );
    this._drawLeftSide(ctx, isActive ? 'selected' : status);

    if (isActive) this._drawImage(ctx, imageLogo, isActive);
    this._renderText(ctx, label, isActive, status);

    let type = '';
    if (window['_canIUseWebP']) type = 'image/webp';
    else type = 'image/png';

    return {
      url: canvas.toDataURL(type),
      ...this._getTotalSize(imageWidth, isActive),
      multiplier
    };
  }
  // static async build(label: string, status, isActive, imageLogo): Promise<any> {
  //   const leftSideWidth = isActive ? this.activeLeftSideWidth : this.leftSideWidth;
  //   const imageWidth = leftSideWidth + this.rightSideWidth;

  //   if ((window as any).markerIcons == null) (window as any).markerIcons = {};

  //   const {canvas, ctx} = this._initCanvas(imageWidth, isActive);

  //   await this._drawBackground(ctx, imageWidth, isActive, status );
  //   await this._drawLeftSide(ctx, isActive ? 'selected' : status);

  //   if (isActive) await this._drawImage(ctx, imageLogo, isActive);
  //   await this._renderText(ctx, label, isActive, status);

  //   let type = '';
  //   if (window['_canIUseWebP']) type = 'image/webp';
  //   else type = 'image/png';

  //   return {
  //     url: await canvas.toDataURL(type),
  //     ...this._getTotalSize(imageWidth, isActive),
  //     multiplier
  //   };
  // }
}
