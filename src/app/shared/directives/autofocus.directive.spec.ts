import {TestBed, ComponentFixture, async} from '@angular/core/testing';
import {AfterViewInit, Component, DebugElement, OnInit} from '@angular/core';
import {By} from '@angular/platform-browser';
import {AutofocusDirective} from './autofocus.directive';
import {setTimeout} from 'timers';

@Component({
  template: `<input type="text" (focus)="isFocused()" [appAutofocus]>`
})
class TestComponent {
  isFocused(): boolean {
    return true;
  }
}

describe('Directive: AutofocusDirective', () => {

  let directive: AutofocusDirective;
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let el: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        AutofocusDirective
      ]
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement.query(By.css('input'));
    directive = new AutofocusDirective(el);
  });

  it('Should create AutofocusDirective instance', () => {
    expect(directive).toBeTruthy();
  });

  // Attention! This test works only when you focus in the browser window!

  xit('Should be focused on the element', async (() => {
    spyOn(component, 'isFocused');
    directive.ngOnInit();
    setTimeout( () => {
      const elNative = el.nativeElement;
      // if (!document.hasFocus()) return;
      const focusedElement = fixture.debugElement.query(By.css(':focus'));
      const focusedNativeElement = focusedElement.nativeElement;
      expect(component.isFocused).toHaveBeenCalled();
      expect(focusedNativeElement).toBe(elNative);
    }, 200);
  }));
});
