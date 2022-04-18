import { Injectable } from '@angular/core';

@Injectable()
export class OpenModalService {
  private isOpen: boolean = false;

  public open(): void {
    if (!this.isOpen) {
      this.isOpen = true;
      document.getElementsByTagName('app-root')[0].classList.add('app-root_fixed');
    }
  }

  public close(): void {
    const modalWindow: number = document.getElementsByClassName('modal fade show in').length;
    const fixedShadow: number = document.getElementsByClassName('app-root_fixed').length;

    if (modalWindow === 0 && fixedShadow !== 0 ) {
      this.isOpen = false;
      document.getElementsByTagName('app-root')[0].classList.remove('app-root_fixed');
    }
  }
}
