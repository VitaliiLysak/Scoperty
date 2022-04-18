import {
  Component,
  Input, Output,
  EventEmitter,
  Inject,
  OnChanges
} from '@angular/core';

import { PropertiesRepositoryService } from '../../../core/services/properties-repository.service';
import { PropertyStatistic } from '../../../core/models/properties-repository.model';
import { LoggerService } from '../../../core/services/logger/logger.service';
import { LOGGER } from '../../../core/services/logger/logger.provider';
import { ExtendedMarkerModel } from '../../../core/models/extended-marker.model';

@Component({
  selector: 'app-marker-detail-statistics',
  templateUrl: './marker-detail-statistics.component.html',
  styleUrls: ['./marker-detail-statistics.component.css']
})

export class MarkerDetailStatisticsComponent implements OnChanges {
  @Input() model: ExtendedMarkerModel = null;
  @Input() userNotAuthorized: boolean = false;

  @Output() showSignup: EventEmitter<string> = new EventEmitter<string>();

  public _name: string = 'marker-detail-statistics';
  public tooltipContent: string = 'Enthält Heizung, Warmwasser und weitere Betriebskosten (Bundesdurchschnitt)';
  public coverText: string = 'Willst du noch mehr über die echte Marktattraktivität dieser Immobilie wissen?';
  public propertyStatistic: PropertyStatistic = {
    numberOfVisits: 0,
    puttedOnFavorite: 0,
    receivedOffers: 0,
    cityAveragePriceM2: 0
  };

  constructor(
    private propertyRepositoryService: PropertiesRepositoryService,
    @Inject(LOGGER) private logger: LoggerService,
  ) {}

  public async ngOnChanges(): Promise<void> {
    if (this.model != null) {
      try {
        const statistics = await this.propertyRepositoryService.getPropertyStatistic(this.model.id);
        if (statistics != null) this.propertyStatistic = statistics;
      } catch (error) {
        this.logger.error('MarkerDetailStatisticsComponent::ngOnInit', error);
      }
    }
  }

  public emitSignup(): void {
    this.showSignup.emit('trend');
  }
}
