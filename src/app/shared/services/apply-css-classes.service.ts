import {
  ElementRef,
  Injectable,
  Renderer2,
} from '@angular/core';

@Injectable()
export class ApplyCssClassesService {
  applyCssClassesToElement(
    renderer: Renderer2,
    elementRef: ElementRef,
    cssClassesToRemove: string[],
    cssClassesToAdd: string[],
  ): void {
    this.removeClasses(renderer, elementRef, cssClassesToRemove);
    this.addClasses(renderer, elementRef, cssClassesToAdd);
  }

  private removeClasses(
    renderer: Renderer2,
    elementRef: ElementRef,
    cssClasses: string[]
  ): void {
    const element = elementRef.nativeElement;
    cssClasses.forEach(cssClass => {
      renderer.removeClass(element, cssClass);
    });
  }

  private addClasses(
    renderer: Renderer2,
    elementRef: ElementRef,
    cssClasses: string[]
  ): void {
    const element = elementRef.nativeElement;
    cssClasses.forEach(cssClass => {
      renderer.addClass(element, cssClass);
    });
  }
}
