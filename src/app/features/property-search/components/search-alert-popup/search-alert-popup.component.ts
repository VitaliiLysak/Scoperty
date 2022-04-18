import {
  Component,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'app-search-alert-popup',
  templateUrl: './search-alert-popup.component.html',
  styleUrls: ['./search-alert-popup.component.css']
})
export class SearchAlertPopupComponent {
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  public _name: string = 'search-alert-popup';

  public dismiss(): void {
    this.close.emit();
  }
}
