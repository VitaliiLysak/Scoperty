import { TestBed, async, inject } from '@angular/core/testing';

import { Subject } from 'rxjs';

import { OverlayService } from './overlay.service';

describe('Service: OverlayService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        OverlayService,
      ],
    }).compileComponents();
  }));

  beforeEach(async(inject([OverlayService], (serv: OverlayService) => {
    this.overlayService = serv;
  })));

  it('should create instance', async(() => {
    expect(this.overlayService).toBeTruthy();
  }));

  it('will return true if overlayStatus property is type of Subject', async(() => {
    expect(this.overlayService.overlayStatus$ instanceof Subject);
  }));

  it('#toggleOverlay will emit false to the subject property, returning void', async(() => {
    // call #subscribe before emitting value
    this.overlayService.overlayStatus$.subscribe(value => {
      expect(value).toBe(false);
    });
    const result = this.overlayService.toggleOverlay(false);
    expect(result).toBeUndefined();
  }));

  it('#toggleOverlay will emit true to the subject property', async(() => {
    // call #subscribe before emitting value
    this.overlayService.overlayStatus$.subscribe(value => {
      expect(value).toBe(true);
    });
    this.overlayService.toggleOverlay(true);
  }));
});
