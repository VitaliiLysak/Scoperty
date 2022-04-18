import {
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

import { NgxModalStack } from 'ngx-multi-modal';

import { ExtendedMarkerModel } from '../../../core/models/extended-marker.model';
import { AuthService } from '../../../core/services/auth.service';
import { PropertiesRepositoryService } from '../../../core/services/properties-repository.service';
import { LoggerService } from '../../../core/services/logger/logger.service';
import { LOGGER } from '../../../core/services/logger/logger.provider';
import { FavoriteModel } from '../../../core/models/favorite-estate.model';
import { ShowSignupModalService } from '../../../core/services/show-signup-modal.service';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogModel,
  ConfirmationDialogType
} from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

export type FavouriteTheme = 'light' | 'dark';
export type FavouriteSize = 'small' | 'large';

@Component({
  selector: 'app-favourite',
  templateUrl: './favourite.component.html',
})
export class FavouriteComponent {
  @Input() marker: ExtendedMarkerModel | FavoriteModel;
  @Input() theme: FavouriteTheme = 'light';
  @Input() size: FavouriteSize = 'small';

  @Output() markerUpdate: EventEmitter<ExtendedMarkerModel | FavoriteModel> = new EventEmitter<ExtendedMarkerModel | FavoriteModel>();

  public get buttonSize(): string {
    return this.size === 'small' ? 'small' : 'small-medium';
  }

  get buttonColor(): string {
    return this.theme === 'light' ? 'full-white' : 'primary-green';
  }

  public get svgIcon(): string {
    return this.marker.isFavourite ? 'favorite' : 'favorite_outline';
  }

  public get svgIconSize(): string {
    return this.size === 'small' ? '14px' : '20px';
  }

  constructor(
    private authService: AuthService,
    private modalService: NgxModalStack,
    private propertiesRepository: PropertiesRepositoryService,
    private showSignupModalService: ShowSignupModalService,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(LOGGER) private logger: LoggerService,
  ) {
  }

  public async onFavourite(property: ExtendedMarkerModel | FavoriteModel): Promise<void> {
    let marker: ExtendedMarkerModel = null;
    if (property instanceof FavoriteModel) {
      marker = await this.propertiesRepository.getMarkerDetails(property.uuid);
    } else {
      marker = property;
    }

    if (!this.authService.isUserLoggedIn()) {
      this.authService.setAddFavoriteSignupInfo(marker.id);
      this.showSignupModalService.showSignup();
    } else if (marker.currentUserIsOwner) {
      this.openYouCannotAddPropertyToFavouritesDialog();
    } else {
      this.markPropertyAsFavourite(marker);
    }
  }

  private openYouCannotAddPropertyToFavouritesDialog(): void {
    const dialogModel: ConfirmationDialogModel = {
      message: 'Du kannst deine eigene Immobilie nicht zu deinen Favoriten hinzufügen.',
      type: ConfirmationDialogType.Info,
      buttonLabel: 'OK',
    };
    const modalRef = this.modalService.openFromComponent(ConfirmationDialogComponent);
    Object.assign(modalRef.instance, dialogModel);
  }

  private async markPropertyAsFavourite(marker: ExtendedMarkerModel): Promise<void> {
    try {
      await this.propertiesRepository.toggleMarkerFavorite(marker.id, marker.isFavourite);
    } catch (error) {
      this.logger.error('PropertyViewComponent::favorite::toggleMarkerFavorite', error);
    }

    marker.isFavourite = !marker.isFavourite;
    this.markerUpdate.emit(marker);

    if (!this.changeDetectorRef['destroyed']) {
      this.changeDetectorRef.detectChanges();
    }
  }
}
