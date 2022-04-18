import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Params, Router, UrlSerializer } from '@angular/router';

import { MapManagerService } from '../../../../core/services/map-manager.service';
import { StateManagerService } from '../../../../core/services/state-manager.service';
import { ExtendedMarkerModel } from '../../../../core/models/extended-marker.model';
import { isSmallDevice } from '../../../../shared/utils/responsive.util';
import { WINDOW } from '../../../../core/services/window.provider';
import { PropertiesRepositoryService } from '../../../../core/services/properties-repository.service';
import { ListingModel } from '../../../../core/models/listing.model';
import { ListingSerializer } from '../../../../core/models/listing.serializer';
import { TRACKING_QUERY_PARAMS } from '../../../../shared/utils/get-tracking-query-params.util';
import { SHARED_ROUTES_NAMES } from '../../../../app.constants';

@Component({
  selector: 'app-sidebar-object',
  templateUrl: './sidebar-object.component.html',
  styleUrls: ['./sidebar-object.component.css']
})
export class SidebarObjectComponent implements AfterViewChecked, OnInit {
  @Input() listing: ListingModel;
  @Input() isShortDetailPageOpened = false;

  @Output() closeSidebar: EventEmitter<any> = new EventEmitter<any>();

  public marker: ExtendedMarkerModel;
  public activeImageIndex: number = 0;
  public _name: string = 'sidebar';
  public images: Array<string>;

  public get isStartPage(): boolean {
    return this.stateManagerService.isStartPage;
  }

  private get url(): string {
    if (this.listing.hasUrl) {
      return this.listing.url;
    } else {
      const path = `/${SHARED_ROUTES_NAMES.PROPERTY_DETAIL}/${this.listing.id}`;
      const tree = this.router.createUrlTree([path], { queryParams: this.trackingQueryParams });
      return this.serializer.serialize(tree);
    }
  }

  public get showPrePrice(): boolean {
    return !this.listing.hasUrl && !this.listing.isStatusMakeMeMove;
  }

  public get sellingStatusTheme(): string {
    return this.marker.hasImages ? 'light' : 'dark';
  }

  constructor(
    private cd: ChangeDetectorRef,
    private mapManagerService: MapManagerService,
    private stateManagerService: StateManagerService,
    private propertiesRepository: PropertiesRepositoryService,
    private router: Router,
    private serializer: UrlSerializer,
    @Inject(WINDOW) private window: Window,
    @Inject(TRACKING_QUERY_PARAMS) private trackingQueryParams: Params,
  ) {}

  public ngOnInit(): void {
    this.marker = ListingSerializer.createMarkerFromListing(this.listing);
  }

  public ngAfterViewChecked(): void {
    this.cd.detach();
  }

  public textForPrePrice(): string {
    if (this.listing.isStatusForSale) {
      return 'Kaufpreis';
    }

    return 'Schätzwert';
  }

  public nextImage(marker: ExtendedMarkerModel, event): void {
    event.stopPropagation();
    if (marker.images == null || marker.images.length < 2) return;
    ++this.activeImageIndex;
    if (this.activeImageIndex >= marker.images.length) this.activeImageIndex = 0;
    this.cd.detectChanges();
  }

  public prevImage(marker: ExtendedMarkerModel, event): void {
    event.stopPropagation();
    if (marker.images == null || marker.images.length < 2) return;
    --this.activeImageIndex;
    if (this.activeImageIndex < 0) this.activeImageIndex = marker.images.length - 1;
    this.cd.detectChanges();
  }

  public async goToMarkerDetail(): Promise<void> {
    if (!this.isShortDetailPageOpened && this.marker.ShowAddress) {
      this.mapManagerService.setActivatedMarkerModel(this.marker);

      if (isSmallDevice()) {
        this.closeSidebar.emit(event);
      }
    } else {
      this.window.open(this.url, '_blank');
    }
  }

  public changeIsFavoriteStatus(marker: ExtendedMarkerModel): void {
    if (this.mapManagerService.hasFavoriteId(marker.id)) {
      this.mapManagerService.deleteFavoriteId(marker.id);
    } else {
      this.mapManagerService.addFavoriteId(marker.id);
    }
  }
}
