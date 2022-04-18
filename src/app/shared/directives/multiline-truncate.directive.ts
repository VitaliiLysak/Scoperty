import {
  AfterViewInit,
  OnChanges,
  Directive,
  Input,
  ElementRef,
  HostListener,
  SimpleChanges,
} from '@angular/core';

interface CSSStyleLineClampDeclaration extends CSSStyleDeclaration {
  webkitLineClamp: number;
}

// The appMultilineTruncate directive should only be used for multiline truncation.
// For single line truncation use the appropriate CSS attributes.

@Directive({
  selector: '[appMultilineTruncate]',
})
export class MultilineTruncateDirective implements AfterViewInit, OnChanges {
  @Input() text: string = '';
  @Input() numberOfLines: number = 2;
  @Input() dotChar: string = '…';

  private initialWords: string[] = [];

  @HostListener('window:resize')
  onResize(): void {
    this.truncate();
  }

  private get nativeElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  private get maxHeight(): number {
    return this.lineHeight * this.numberOfLines;
  }

  private get lineHeight(): number {
    const elementStyle = window.getComputedStyle(this.nativeElement);
    const lineHeightPropertyValue = elementStyle.getPropertyValue('line-height');
    const lineHeight = this.fromPixelsToNumber(lineHeightPropertyValue);

    return lineHeight;
  }

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    this.truncate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { text } = changes;
    const changedText = text ? text.currentValue : null;
    if (changedText) {
      this.initialWords = changedText.split('');
    }
    this.truncate();
  }

  private truncate(): void {
    const element = this.nativeElement;
    const style = element.style as CSSStyleLineClampDeclaration;
    const supportsNativeClamp = typeof(style.webkitLineClamp) !== 'undefined';
    if (supportsNativeClamp) {
      this.applyNativeClamp(element);
    } else {
      this.applyFakeClamp(element);
    }
  }

  private fromPixelsToNumber(pixels: string): number {
    return pixels ? parseInt(pixels.replace('px', ''), 10) : 0;
  }

  private cloneWords(words: string[]): string[] {
    return JSON.parse(JSON.stringify(words));
  }

  private stringFromWords(words: string[]): string {
    return words.join('').trim();
  }

  // Native LineClamp is only available on some browsers using webkit as their browser engine,
  // see: https://caniuse.com/#search=Line%20Clamp

  private applyNativeClamp(element: HTMLElement): void {
    const style = element.style as CSSStyleLineClampDeclaration;
    style.display = '-webkit-box';
    style.overflow = 'hidden';
    style.textOverflow = 'ellipsis';
    style.webkitBoxOrient = 'vertical';
    style.webkitLineClamp = this.numberOfLines;
    element.innerText = this.text;
  }

  private applyFakeClamp(element: HTMLElement): void {
    let words = this.cloneWords(this.initialWords);
    element.innerText = this.stringFromWords(words);
    while (element.clientHeight > this.maxHeight) {
      words = words.slice(0, -1);
      element.innerText = `${ this.stringFromWords(words) }${ this.dotChar }`;
    }
  }
}
