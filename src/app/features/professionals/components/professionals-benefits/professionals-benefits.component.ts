import { Component } from '@angular/core';

import { MailToLinks } from '../../../../app.constants';

const MAIL_TO_SUBJECT: string = 'Ich möchte eine Anzeige auf Scoperty schalten';

@Component({
  selector: 'app-professionals-benefits',
  templateUrl: './professionals-benefits.component.html',
  styleUrls: [
    './professionals-benefits.component.css',
  ],
})
export class ProfessionalsBenefitsComponent {
  public _name: string = 'professionals-benefits';

  public realtorsMailToLink: string = `${ MailToLinks.Realtors }?subject=${ MAIL_TO_SUBJECT }`;
}
