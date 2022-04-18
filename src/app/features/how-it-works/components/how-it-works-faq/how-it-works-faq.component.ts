import { Component } from '@angular/core';

import {
  MailToLinks,
  SHARED_ROUTES_NAMES,
} from '../../../../app.constants';
import { ShowDissentPropertyModalService } from '../../../../core/services/show-dissent-property-modal.service';

@Component({
  selector: 'app-how-it-works-faq',
  templateUrl: './how-it-works-faq.component.html',
  styleUrls: [
    './how-it-works-faq.component.css',
  ],
})
export class HowItWorksFaqComponent {
  name: string = 'how-it-works-faq';

  dataProtectionPageLink: string[] = [ `/${ SHARED_ROUTES_NAMES.DATAPROTECTION }` ];
  linkToContactMailTo: string = MailToLinks.Contact;
  linkToDataProtectionMailTo: string = MailToLinks.DataProtection;

  constructor(public showDissentPropertyModalService: ShowDissentPropertyModalService) {}
}
