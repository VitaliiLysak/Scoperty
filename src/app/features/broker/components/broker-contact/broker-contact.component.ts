import {
  Component,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-broker-contact',
  templateUrl: './broker-contact.component.html',
  styleUrls: [
    './broker-contact.component.css',
  ],
})
export class BrokerContactComponent {
  @Input()
  icon: string;

  @Input()
  linkId: string;

  @Input()
  href: string;

  @Input()
  heading: string;

  @Input()
  message: string;

  public _name: string = 'broker-contact';
}
