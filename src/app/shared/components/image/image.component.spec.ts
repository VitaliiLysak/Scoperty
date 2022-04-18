import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { HttpClient, HttpHandler, HttpClientModule } from '@angular/common/http';
import { MapsAPILoader } from '@agm/core';
import { AgmCoreModule } from '@agm/core/core.umd'; // to pass MapsApiLoader.load not recognision in karma test

import { BEMPipe } from '../../pipes/bem.pipe';

import { ImageComponent } from './image.component';


@Component({
  selector: `app-mock-host-component`,
  template: `<app-image [src]="testSource"></app-image>`
})
class TestHostComponent {
  testSource: string = null;
}

describe('Testing ImageComponent', () => {
  let testHostComponent: TestHostComponent;
  let testHostFixture: ComponentFixture<TestHostComponent>;


  let component: ImageComponent;
  let fixture: ComponentFixture<ImageComponent>;


  // to pass MapsApiLoader.load not recognision in karma test
  beforeEach(async() => {
    this.apiLoader = jasmine.createSpyObj('MapsAPILoader', ['load']);
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ImageComponent,
        TestHostComponent,

        BEMPipe,
      ],
      imports: [
        RouterTestingModule,
        HttpClientModule,

        AgmCoreModule,    // to pass MapsApiLoader.load not recognision in karma test
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
      providers: [
        HttpClient,
        HttpHandler,
        // to pass MapsApiLoader.load not recognision in karma test
        {
          provide: MapsAPILoader,
          useValue: {
            load: this.apiLoader.load.and.returnValue(new Promise(resolve => resolve(true)))
          }
        }
      ],
    }).compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(ImageComponent);
    component = fixture.componentInstance;
    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = testHostFixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the image component', async(() => {
    expect(component).toBeTruthy();
  }));

  it(`should have img`, async(() => {
    const el = fixture.debugElement.nativeElement;
    expect(el.firstElementChild.tagName).toBe('IMG');
  }));

  it(`should have image after load function`, async(() => {
    const image = testHostFixture.debugElement.nativeElement.firstElementChild.firstElementChild;
    image.onload = () => expect(image.naturalWidth).toBeGreaterThan(0);
    testHostFixture.detectChanges();
    expect(image.src).toMatch('/assets/images/pic.png');
  }));

  it('should create window.blobImages object if it does not exist yet', () => {
    (window as any).blobImages = null;
    component['_loadFromCache']('ferv');
    expect((window as any).blobImages).not.toBeNull();
  });

  // FIXME: Do not test private methods or attributes
  it('should return blobImages[src] if it exists', () => {
    const src = 'ferv';

    (window as any).blobImages = [];
    (window as any).blobImages[src] = 'ergerg';
    component['_loadFromCache']('ferv');

    expect((window as any).blobImages[src]).toEqual('ergerg');
  });

  // it(`should have @@@`, async(() => {
  //   testHostFixture = TestBed.createComponent(TestHostComponent);
  //   testHostComponent = testHostFixture.componentInstance;
  //   testHostComponent.testSource = 'http://35.158.55.48/assets/images/marker-detail-similar-house.jpg';
  //   const image = testHostFixture.debugElement.nativeElement.firstElementChild.firstElementChild;
  //   image.onload = () => expect(image.naturalWidth).toBeGreaterThan(0);
  //   testHostFixture.detectChanges();
  // }));
});
