// import {TestBed, ComponentFixture, async} from '@angular/core/testing';
// import {Component, DebugElement} from '@angular/core';
// import {By} from '@angular/platform-browser';
// import {AutoCollapseDirective} from './autocollapse';

// @Component({
//   template: `<div autoCollapse (toggleChange)="onToggleChange()"></div>`
// })
// class TestComponent {
//   public onToggleChange() {
//     return true;
//   }
// }

// describe('Directive: AutoCollapseDirective', () => {
//   let directive: AutoCollapseDirective;
//   let component: TestComponent;
//   let fixture: ComponentFixture<TestComponent>;
//   let el: DebugElement;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       declarations: [
//         TestComponent,
//         AutoCollapseDirective
//       ]
//     });
//     fixture = TestBed.createComponent(TestComponent);
//     component = fixture.componentInstance;
//     el = fixture.debugElement.query(By.css('div'));
//     directive = new AutoCollapseDirective(el);
//   });

//   it('Should create AutoCollapseDirective instance', () => {
//     expect(directive).toBeTruthy();
//   });

//   it('Should emit toggleChange event', (done) => {
//     directive.toggleChange.subscribe(g => {
//       expect(g).toEqual(undefined);
//       done();
//     });
//     directive.toggleChange.emit();
//   });

//   it('Should not emit if directive is just inited', async(() => {
//     spyOn(component, 'onToggleChange');
//     document.dispatchEvent(new Event('click'));
//     setTimeout( () => {
//       expect(component.onToggleChange).not.toHaveBeenCalled();
//     }, 100);
//   }));

//   // error spy hasn't been called, fix later
//   xit('Should emit if directive already exist', async(() => {
//     spyOn(component, 'onToggleChange');
//     document.dispatchEvent(new Event('click'));
//     document.dispatchEvent(new Event('click'));
//     setTimeout( () => {
//       expect(component.onToggleChange).toHaveBeenCalled();
//     }, 100);
//   }));
// });
