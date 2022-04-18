import { Component, Inject, OnInit } from '@angular/core';

import { NgxModalStack } from 'ngx-multi-modal';

import { PropertiesRepositoryService } from '../../../../core/services/properties-repository.service';
import {
  DeleteSearchTemplateComponent,
  DeleteTemplateModel,
} from '../../components/delete-search-template/delete-search-template.component';
import { isSmallMobileDevice$ } from '../../../../shared/utils/responsive.util';
import { LoggerService } from '../../../../core/services/logger/logger.service';
import { LOGGER } from '../../../../core/services/logger/logger.provider';
import { AnalyticsService } from '../../../../core/services/analytics/analytics.service';
import { SearchAlert } from '../../../../core/models/search-alert.model';
import { SHARED_ROUTES_NAMES } from '../../../../app.constants';
import { Router } from '@angular/router';
import { QP_OPEN_SEARCH_ALERT_MODAL, QueryParamsService } from '../../../../core/services/query-params.service';

@Component({
  selector: 'app-property-search-alerts',
  templateUrl: './property-search-alerts.component.html',
  styleUrls: ['./property-search-alerts.component.css']
})

export class PropertySearchAlertsComponent implements OnInit {
  name: string = 'property-search-alerts';

  isLoaded: boolean = false;
  searchAlerts: Array<SearchAlert> = [];

  isSmallMobileDevice$ = isSmallMobileDevice$;

  get isSearchTemplatesLoaded(): boolean {
    return this.searchAlerts && this.searchAlerts.length > 0;
  }

  get searchTemplatesIsEmpty(): boolean {
    return this.searchAlerts.length === 0;
  }

  // @FIXME: temporary solution without pagination, fix later
  private async loadSearchTemplates(): Promise<void> {
    try {
      this.searchAlerts = await this.propertiesRepositoryService.getSearchAlerts();
      this.isLoaded = true;
    } catch (error) {
      this.logger.error('PropertySearchAlertsComponent::loadSearchTemplates', error);
    }
  }

  private async updateAlert(alert: SearchAlert, payload: any): Promise<void> {
    try {
      await this.propertiesRepositoryService.updateSearchAlert(alert.uuid, payload);
      this.analyticsService.triggerFormSubmissionSuccess('updateSearchAlertForm', 'update-search-alert-from-profile');
    } catch (error) {
      this.logger.error('PropertySearchAlertsComponent::updateAlert', error);
    }
  }

  constructor(
    private propertiesRepositoryService: PropertiesRepositoryService,
    private modalService: NgxModalStack,
    private analyticsService: AnalyticsService,
    private router: Router,
    private queryParamsService: QueryParamsService,
    @Inject(LOGGER) private logger: LoggerService,
  ) {}

  ngOnInit(): void {
    this.loadSearchTemplates();
  }

  saveAlertName(template: SearchAlert): void {
    this.updateAlert(template, {name : template.name});
  }

  changeEmailFrequency(template: SearchAlert): void {
    this.updateAlert(template, { emailFrequency: template.emailFrequency });
  }

  openSearchAlertMap() {
    const queryParams = {};
    queryParams[QP_OPEN_SEARCH_ALERT_MODAL] = true;
    this.router.navigate([`/${SHARED_ROUTES_NAMES.MAP}`], {queryParamsHandling: 'merge', queryParams});
  }

  async deleteItem(id: string): Promise<void> {
    const dialogModel: DeleteTemplateModel = {
      alertId: id,
    };
    const modalRef = this.modalService.openFromComponent(DeleteSearchTemplateComponent);
    Object.assign(modalRef.instance, dialogModel);
    const modalResult = await modalRef.result;

    if (modalResult) {
      const index = this.searchAlerts.findIndex(item => item.uuid === id);
      this.searchAlerts.splice(index, 1);
    }
  }

  trackByTemplateUuid(index: number, template: SearchAlert): string {
    return template.uuid;
  }
}
