import { TestBed, inject } from '@angular/core/testing';

import { SchedulerService, ITimer } from './scheduler.service';

function isObjectHasType<T>(object: any): object is T {
  // id is set to Timeout{ _id: number, _clearFn: function clearTimeout() {...} }
  return ('id'          in object && typeof object.id         === 'number')
      && ('reject'      in object && typeof object.reject     === 'function')
      && ('safeReject'  in object && typeof object.safeReject === 'function');
}

describe('Service: SchedulerService', () => {
  beforeEach((() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        SchedulerService,
      ],
    }).compileComponents();
  }));

  beforeEach((inject([SchedulerService], (serv: SchedulerService) => {
    this.schedulerService = serv;
  })));

  describe('#sleep', () => {
    beforeEach(() => {
      this.sleepMethod = spyOn(this.schedulerService, 'sleep').and.callThrough();
      jasmine.clock().install();
    });

    it('will return a value of type ITimer', (() => {
      const result = this.schedulerService.sleep();

      expect(isObjectHasType<ITimer>(result)).toBeTruthy();
    }));

    it('at first will not be called and will be called after time+1 ms', () => {
      expect(this.sleepMethod).not.toHaveBeenCalled();
      this.schedulerService.sleep(100);
      jasmine.clock().tick(101);
      expect(this.sleepMethod).toHaveBeenCalled();
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });
  });

  it('will return undefined when called', () => {
    const testCallback = () => {};
    expect(this.schedulerService.next(testCallback)).toBeUndefined();
  });
});
