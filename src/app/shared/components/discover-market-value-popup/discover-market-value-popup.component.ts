import {
  Component,
  EventEmitter,
  Output
} from '@angular/core';

@Component({
  selector: 'app-discover-market-value-popup',
  templateUrl: './discover-market-value-popup.component.html',
  styleUrls: [
    './discover-market-value-popup.component.css',
  ],
})
export class DiscoverMarketValuePopupComponent {
  @Output() updateAddress: EventEmitter<void> = new EventEmitter<void>();
  @Output() redirectToMap: EventEmitter<void> = new EventEmitter<void>();

  public name: string = 'discover-market-value-popup';

  public changeAddress(): void {
    this.updateAddress.emit();
  }

  public goToMap(): void {
    this.redirectToMap.emit();
  }
}
