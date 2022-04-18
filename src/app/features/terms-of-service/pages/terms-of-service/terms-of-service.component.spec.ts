import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TermsOfServiceComponent } from './terms-of-service.component';
import { BEMPipe } from '../../../../shared/pipes/bem.pipe';

describe('TermsOfServiceComponent tests', () => {
  let fixture;
  let component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
         TermsOfServiceComponent,
         BEMPipe
      ],
      imports: [
        RouterTestingModule
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent( TermsOfServiceComponent);
    component = fixture.componentInstance;
  });

  it('Should create the component', () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('Should return name of component', () => {
    expect(component._name).toBe('terms-of-service');
  });
});
