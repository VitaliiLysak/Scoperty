import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { MarkerDetailDataDescriptionComponent } from './marker-detail-data-description.component';

import { BEMPipe } from '../../pipes/bem.pipe';
import { UserService } from '../../../core/services/user.service';

describe('Testing MarkerDetailDataDescriptionComponent', () => {
  let component: MarkerDetailDataDescriptionComponent;
  let fixture: ComponentFixture<MarkerDetailDataDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
      ],
      declarations: [
        MarkerDetailDataDescriptionComponent,
        BEMPipe,
      ],
      providers: [
        UserService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MarkerDetailDataDescriptionComponent);
    component = fixture.componentInstance;
    component.model = {
      'GeneralDescription' : 'aaa',
    };
    fixture.detectChanges();
  }));


  it('should create marker-detail-data-description component', () => {
    expect(component).toBeTruthy();
  });
});

