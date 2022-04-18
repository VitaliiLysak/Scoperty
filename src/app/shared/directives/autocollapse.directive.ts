import {
  Directive,
  OnInit,
  ElementRef,
  HostListener,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

@Directive({
  selector: '[appAutoCollapse]'
})
export class AutoCollapseDirective implements OnInit {

  @Output() toggleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  _el: any;
  _isJustInited;

  constructor(private elementRef: ElementRef) {
    this._isJustInited = true;
  }

  ngOnInit() {
    this._el = this.elementRef.nativeElement;
  }

  @HostListener('document:click', ['$event.target']) outsideClick(target) {
    if (this._isJustInited) {
      this._isJustInited = false;
      return;
    }
    this.toggleChange.emit();
  }

}
