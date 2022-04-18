import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';

import {
  SeoMeta,
  SeoService,
} from '../../../../../core/services/seo.service';

const SEO_META: SeoMeta = {
  title: 'Kostenlose Immobilienbewertung',
  description: 'Kostenlose Immobilienbewertung bei Scoperty: Schätzwerte aller Immobilien sofort einsehbar.',
  robots: 'index, follow',
};

@Component({
  selector: 'app-property-valuation',
  templateUrl: './property-valuation.component.html',
  styleUrls: [
    './property-valuation.component.css',
  ],
})
export class PropertyValuationComponent implements OnInit, OnDestroy {
  name: string = 'property-valuation';

  heading: string = 'Kostenlose Immobilienbewertung';
  subheading: string = 'Bei uns erfährst du sofort, was deine Immobilie wert ist';
  bannerText: string = 'Jetzt in Berlin, Hamburg, München, Köln, Frankfurt und Nürnberg!';
  listText: Array<string> = [
    'Nutze den Scoperty Schätzwert für die Preisfindung',
    'Erhalte proaktive Gebote von solventen Käufern',
    'Erleichtere dir den Verkauf mit einem geprüften Makler',
  ];
  findPropertyInputLabel: string = 'Adresse eingeben';
  findPropertyButtonTitle: string = 'Zum Schätzwert';

  advertisePropertyHeading: string = 'Inseriere deine Immobilie kostenlos';

  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.setMeta(SEO_META);
  }

  ngOnDestroy(): void {
    this.seoService.resetMeta();
  }
}
