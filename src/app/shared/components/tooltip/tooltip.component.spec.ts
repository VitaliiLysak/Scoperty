import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TooltipComponent } from './tooltip.component';
import { BEMPipe } from '../../pipes/bem.pipe';

describe('Testing TooltipComponent', () => {
  let component: TooltipComponent;
  let fixture: ComponentFixture<TooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TooltipComponent,
        BEMPipe
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create tooltip component', () => {
    expect(component).toBeTruthy();
  });

  it('should render proper text in tooltip body', () => {
    const tooltipBody = fixture.debugElement.query(By.css('.tooltip__content')).nativeElement;
    component.tooltipText = 'test text';
    fixture.detectChanges();
    expect(tooltipBody.textContent).toContain('test text');
  });
});
