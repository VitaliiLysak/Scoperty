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
  title: 'Immobilie kostenlos inserieren auf Scoperty',
  description: 'Immobilie inserieren auf Scoperty - inkl. kostenloser Immobilienbewertung, sofort einsehbar',
  robots: 'index, follow',
};

@Component({
  selector: 'app-property-sale',
  templateUrl: './property-advertisement.component.html',
  styleUrls: [
    './property-advertisement.component.css',
  ],
})
export class PropertyAdvertisementComponent implements OnInit, OnDestroy {
  @ViewChild(PropertyValuationWePayPhotographComponent) wePayPhotographComponent: PropertyValuationWePayPhotographComponent;

  name: string = 'property-advertisement';

  heading: string = 'Inseriere deine Immobilie kostenlos auf Scoperty';
  subheading: string = `
    Der kostenlose Scoperty Schätzwert hilft dir bei der Preisfindung.
    Gib einfach die Adresse deiner Immobilie ein und sehe direkt den Schätzwert ein.
  `;
  bannerText: string = 'Jetzt in Berlin, Hamburg, München, Köln, Frankfurt und Nürnberg!';
  findPropertyInputLabel: string = 'Adresse eingeben';
  findPropertyButtonTitle: string = 'Zum Schätzwert';

  advertisePropertyHeading: string = 'Inseriere deine Immobilie kostenlos';

  howItWorksHeading: string = 'Du möchtest deine Immobilie kostenlos zum Verkauf stellen? So funktioniert’s.';
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
      message: 'Stelle deine Immobilie zum Verkauf',
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
