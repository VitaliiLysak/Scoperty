import {
  Component,
  OnDestroy,
  OnInit, ViewChild,
} from '@angular/core';

import {
  SeoMeta,
  SeoService,
} from '../../../../core/services/seo.service';
import {
  HowItWorksStep
} from '../../../../shared/components/landing-pages/property-valuation-how-it-works/property-valuation-how-it-works.component';
import {
  PropertyValuationWePayPhotographComponent
} from '../../../../shared/components/landing-pages/property-valuation-we-pay-photograph/property-valuation-we-pay-photograph.component';
import { isNullOrUndefined } from '../../../../shared/utils/null-or-undefined.util';

const SEO_META: SeoMeta = {
  title: 'Wohnung kostenlos verkaufen auf Scoperty',
  description: 'Wohnung verkaufen auf Scoperty - inkl. kostenloser Immobilienbewertung, sofort einsehbar',
  robots: 'index, follow',
};

@Component({
  selector: 'app-apartment-sale',
  templateUrl: './apartment-sale.component.html',
  styleUrls: ['./apartment-sale.component.css']
})
export class ApartmentSaleComponent implements OnInit, OnDestroy {
  @ViewChild(PropertyValuationWePayPhotographComponent) wePayPhotographComponent: PropertyValuationWePayPhotographComponent;

  name: string = 'apartment-sale';

  heading: string = 'Verkaufe deine Wohnung auf Scoperty';
  subheading: string = 'Der kostenlose Scoperty Schätzwert hilft dir bei der Preisfindung.';
  bannerText: string = 'Jetzt in Berlin, Hamburg, München, Köln, Frankfurt und Nürnberg!';
  listText: Array<string> = [
    'Sehe sofort den Schätzwert deiner Wohnung ein',
    'Inseriere deine Wohnung kostenlos',
    'Erhalte proaktive Gebote von solventen Käufern',
  ];
  findPropertyInputLabel: string = 'Adresse eingeben ';
  findPropertyButtonTitle: string = 'Zum Schätzwert';

  advertisePropertyHeading: string = 'Inseriere deine Wohnung kostenlos';

  howItWorksHeading: string = 'Du möchtest deine Wohnung kostenlos zum Verkauf stellen? So funktioniert’s.';
  howItWorksSteps: HowItWorksStep[] = [
    {
      icon: 'address',
      message: 'Gib die Adresse deiner Immobilie ein und erhalte den Schätzwert',
    },
    {
      icon: 'register',
      message: 'Registriere dich als Eigentümer und vervollständige deine Immobilienangaben',
    },
    {
      icon: 'sell',
      message: 'Stelle deine Wohnung zum Verkauf',
    },
  ];

  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.setMeta(SEO_META);
  }

  ngOnDestroy(): void {
    this.seoService.resetMeta();
  }

  scrollToWePayPhotograph(): void {
    if (!isNullOrUndefined(this.wePayPhotographComponent)) {
      this.wePayPhotographComponent.scrollTo();
    }
  }
}
