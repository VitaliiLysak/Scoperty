import {
  Component,
  EventEmitter,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-mobile-navbar',
  templateUrl: './mobile-navbar.component.html',
  styleUrls: [
    './mobile-navbar.component.css',
  ],
})
export class MobileNavbarComponent {
  @Output()
  logo: EventEmitter<void> = new EventEmitter<void>();

  public _name: string = 'mobile-navbar';

  public onLogoClick(): void {
    this.logo.emit();
  }
}
