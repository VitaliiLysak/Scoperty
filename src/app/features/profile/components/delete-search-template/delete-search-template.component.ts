import { Component, Inject } from '@angular/core';

import { NgxActiveModal } from 'ngx-multi-modal';

import { OpenModalService } from '../../../../core/services/open-modal.service';
import { PropertiesRepositoryService } from '../../../../core/services/properties-repository.service';
import { LoggerService } from '../../../../core/services/logger/logger.service';
import { LOGGER } from '../../../../core/services/logger/logger.provider';

export interface DeleteTemplateModel {
  alertId: string;
}

@Component({
  selector: 'app-delete-search-template',
  templateUrl: './delete-search-template.component.html',
  styleUrls: ['./delete-search-template.component.css'],
})

export class DeleteSearchTemplateComponent implements DeleteTemplateModel {
  public alertId: string = '';
  public dontAskAgain: boolean = false;
  public _name: string = 'delete-search-template';

  constructor(
    public activeModal: NgxActiveModal,
    private propertiesRepository: PropertiesRepositoryService,
    @Inject(LOGGER) private logger: LoggerService,
  ) { }

  private async deleteAlert(id: string): Promise<void> {
    try {
      this.propertiesRepository.removeSearchAlert(id);
    } catch (error) {
      this.logger.error('DeleteSearchTemplateComponent:deleteAlert:Error', error);
    }
  }

  public apply(): void {
    this.deleteAlert(this.alertId);

    this.activeModal.close(true);
  }

  public hideModal(): void {
    this.activeModal.close();
  }

  public dismiss(): void {
    this.activeModal.dismiss();
  }
}
