import { Injectable } from '@angular/core';

export interface ITimer extends Promise<null> {
  id: number;
  reject: () => void;
  safeReject: () => void;
}

@Injectable()
export class SchedulerService {

  private _buildTimer(time: number = 1): ITimer {
    const tmp = <any>{};
    const handlers = <any>{};
    const timer = new Promise<null>((resolve, reject) => {
      handlers.reject = reject;
      handlers.resolve = resolve;
      tmp.id = setTimeout(resolve, 1, null);
    }) as ITimer;
    timer.id = tmp.id;
    timer.reject = () => {
      clearTimeout(timer.id as any);
      handlers.reject();
    };
    timer.safeReject = () => {
      clearTimeout(timer.id as any);
      handlers.resolve();
    };
    return timer;
  }

  constructor() {}

  public sleep(time: number = 1): ITimer {
    return this._buildTimer(time);
  }

  public next(cb): void {
    setTimeout(cb, 1);
  }
}
