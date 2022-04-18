import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

import {
  cloneDeep,
  debounce,
} from 'lodash';
import {
  NgxActiveModal,
  NgxModalStack,
} from 'ngx-multi-modal';

import { ExtendedMarkerModel } from '../../../../core/models/extended-marker.model';
import { PropertyStatus } from '../../../../core/models/properties-repository.model';
import { StateManagerService } from '../../../../core/services/state-manager.service';
import { PropertiesRepositoryService } from '../../../../core/services/properties-repository.service';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogModel,
  ConfirmationDialogType
} from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-property-settings',
  templateUrl: './property-settings.component.html',
  styleUrls: ['./property-settings.component.css']
})
export class PropertySettingsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() marker: any = null;
  @Input() rights: string;
  @Input() propertyPrice: number;

  @Output() activateTab: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateActiveProperty: EventEmitter<void> = new EventEmitter<void>();
  @Output() updateDirtyProperty: EventEmitter<any> = new EventEmitter<any>();
  @Output() changeFeedbackSavingDisplay: EventEmitter<any> = new EventEmitter<any>();

  public _name: string = 'property-settings';
  public dirtyMarker: ExtendedMarkerModel = null;
  public message: string = '';

  public scrollBlock: any = null;
  public myPropertiesEditSaveBtn: any = null;
  public isSaveBtnInViewport: boolean = false;

  public options: any =  {
    delete: 'save',
  };

  private isElementInViewport (el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
  }

  constructor(
    private stateManagerService: StateManagerService,
    private propertiesRepository: PropertiesRepositoryService,
    private modalService: NgxModalStack,
    private activeModal: NgxActiveModal,
  ) {
    this.onScroll = debounce(this.onScroll.bind(this), 300);
  }

  public ngOnInit() {
    this.myPropertiesEditSaveBtn = document.getElementById('myPropertiesSettingsSaveBtn');
    this.scrollBlock = document.getElementById('scrollBlock');
    this.scrollBlock.addEventListener('scroll', () => {
      this.onScroll();
    });
  }

  public ngOnChanges() {
    this.dirtyMarker = cloneDeep(this.marker);
  }

  public ngOnDestroy() {
    this.scrollBlock.removeEventListener('scroll', () => {
      this.onScroll();
    });
  }

  public onScroll(): void {
    const isSaveBtnInViewportNew = this.isElementInViewport(this.myPropertiesEditSaveBtn);
    if (this.isSaveBtnInViewport === isSaveBtnInViewportNew) return;
    this.isSaveBtnInViewport = isSaveBtnInViewportNew;
    this.emitChangeFeedbackSavingDisplay(!this.isSaveBtnInViewport);
  }

  public get priceToStr(): string {
    return this.dirtyMarker.Price.toLocaleString('de-DE') + ' €';
  }

  public checkInputValues(event: any): void {
    const key = event.key || String.fromCharCode(event.which || event.code || event.keyCode);
    const checkArr = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '', 'Backspace', 'Delete', 'Control', 'ArrowRight', 'ArrowLeft'];
    if (checkArr.indexOf(key) === -1) {
      event.preventDefault();
    }
  }

  public async saveSettings(): Promise<void> {
    try {
      await this.propertiesRepository.updatePropertyDetail(this.dirtyMarker.id, this.dirtyMarker);
      this.emitUpdateActiveProperty();
      this.showSuccessfulSellingStatusChangeDialog();
    } catch (error) {
      // FIXME: Implement showing error modal, ask UX-Team for design
    }
  }

  public _activateTab(tab: string, update: boolean) {
    this.activateTab.emit({tab, update});
  }

  public async removeOwnership(): Promise<void> {
    await this.propertiesRepository.removeOwnership(this.marker.id);
    this._activateTab('overview', true);
  }

  public get isDirtyMarkerUpdated () {
    return  JSON.stringify(this.marker) !== JSON.stringify(this.dirtyMarker);
  }

  public emitUpdateActiveProperty() {
    this.updateActiveProperty.emit();
  }

  public emitUpdateDirtyProperty() {
    this.updateDirtyProperty.emit(this.dirtyMarker);
  }

  public emitChangeFeedbackSavingDisplay(display: boolean) {
    this.changeFeedbackSavingDisplay.emit(display);
  }

  public onSellingStatusChange(sellingStatus: PropertyStatus): void {
    this.dirtyMarker.SellingStatus = sellingStatus;
    this.dirtyMarker.SalePrice = null;
    this.emitUpdateDirtyProperty();
  }

  public showSuccessfulSellingStatusChangeDialog(): void {
    const dialogModel: ConfirmationDialogModel = {
      message: 'Deine Änderungen sind gespeichert!',
      type: ConfirmationDialogType.Success,
      buttonLabel: 'Fortfahren',
    };
    const modalRef = this.modalService.openFromComponent(ConfirmationDialogComponent);
    Object.assign(modalRef.instance, dialogModel);
  }
}
