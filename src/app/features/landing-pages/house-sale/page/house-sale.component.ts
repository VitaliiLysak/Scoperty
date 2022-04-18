import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
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
  title: 'Haus kostenlos verkaufen auf Scoperty',
  description: 'Haus verkaufen auf Scoperty - inkl. kostenloser Immobilienbewertung, sofort einsehbar',
  robots: 'index, follow',
};

@Component({
  selector: 'app-house-sale',
  templateUrl: './house-sale.component.html',
  styleUrls: ['./house-sale.component.css']
})
export class HouseSaleComponent implements OnInit, OnDestroy {
  @ViewChild(PropertyValuationWePayPhotographComponent) wePayPhotographComponent: PropertyValuationWePayPhotographComponent;

  public name: string = 'house-sale';

  heading: string = 'Verkaufe dein Haus auf Scoperty';
  subheading: string = 'Der kostenlose Scoperty Schätzwert hilft dir bei der Preisfindung.';
  bannerText: string = 'Jetzt in Berlin, Hamburg, München, Köln, Frankfurt und Nürnberg!';
  listText: Array<string> = [
    'Sehe sofort den Schätzwert deines Hauses ein',
    'Inseriere dein Haus kostenlos',
    'Erhalte proaktive Gebote von solventen Käufern',
  ];
  findPropertyInputLabel: string = 'Adresse eingeben';
  findPropertyButtonTitle: string = 'Zum Schätzwert';

  advertisePropertyHeading: string = 'Inseriere dein Haus kostenlos';

  howItWorksHeading: string = 'Du möchtest dein Haus kostenlos zum Verkauf stellen? So funktioniert’s.';
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
      message: 'Stelle dein Haus zum Verkauf',
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
