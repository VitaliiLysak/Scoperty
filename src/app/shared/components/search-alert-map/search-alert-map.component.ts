import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { merge, Observable, Subscription } from 'rxjs';
import { debounceTime, map, take } from 'rxjs/operators';
import { MapsAPILoader } from '@agm/core';

import { MAP_STYLED_TYPE } from '../../../gmaps.style';
import { Point } from '../../../core/models/location.model';
import { GmapsUtils } from '../../utils/gmaps.util';
import {
  bestRadiusForZoomLevel,
  bestRadiusForZoomLevelInSmallerScheme,
  bestZoomLevelForRadius,
  ZoomAndRadius
} from '../../utils/map-radius.util';

@Component({
  selector: 'app-search-alert-map',
  templateUrl: './search-alert-map.component.html',
  styleUrls: ['./search-alert-map.component.css'],
  animations: [
    trigger('mapDragAnimation', [
      // ...
      state('false', style({
        opacity: 0.31,
      })),
      state('true', style({
        opacity: 0.15,
      })),
      transition('* => *', [
        animate('200ms')
      ]),
    ]),
  ],
})
export class SearchAlertMapComponent implements AfterViewInit, OnDestroy {
  @Input()
  schema: 'smaller' | 'default' = 'default';
  @Input()
  minZoom = 1;
  @Input()
  set location(point: Point) {
    this._location = point;
    if (this.googleMap && !this.googleMap.getCenter().equals(new google.maps.LatLng(point))) {
      this.googleMap.setCenter(point);
    }
  }

  get location(): Point {
    return this._location;
  }

  private _location: Point = {lat: 50, lng: 30};

  @Output() locationChange = new EventEmitter<Point>();

  @Input()
  set radius(radius: number) {
    if (this._radius === radius) {
      return;
    }

    this._radius = radius;

    if (this.initialized) {
      this.handleRadius();
    }
  }

  get radius(): number {
    return this._radius;
  }

  private _radius: number = 45000;

  @Output() radiusChange = new EventEmitter<number>();

  @Input()
  set zoom(zoom: number) {
    if (this.initialized) {
      this.googleMap.setZoom(zoom);
    } else {
      this.presetZoom = zoom;
    }
  }

  get zoom(): number {
    return this.googleMap.getZoom();
  }

  private presetZoom = 14;

  @Output() zoomChange = new EventEmitter<number>();

  @ViewChild('mapCanvas')
  private mapCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('mapWrapper')
  private mapWrapper: ElementRef<HTMLDivElement>;

  mapDrag$: Observable<boolean>;
  googleMap: google.maps.Map = null;
  googleMapContainer: HTMLDivElement;
  ctx: CanvasRenderingContext2D;

  private subscriptions: Subscription = new Subscription();
  private mapCenterChange$: Observable<void>;
  private mapZoom$: Observable<void>;
  private mapLoaded$: Observable<void>;
  private doNotHandleZoom = false;
  private initialized = false;

  get mapDimension(): number {
    const { width, height } = this.ctx.canvas;
    return Math.min(width, height);
  }

  private get padding(): number {
    return this.hasSmallMapDimension ? 10 : 50;
  }

  private get maxZoom(): number {
    return this.hasSmallMapDimension ? 16 : 17;
  }

  private get hasSmallMapDimension(): boolean {
    return this.mapDimension < 290;
  }

  constructor(
    private elementRef: ElementRef,
    private mapsAPILoader: MapsAPILoader,
  ) {
  }

  ngAfterViewInit(): void {
    this.createMap();
    this.createCanvas();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  async createMap(): Promise<void> {
    await this.mapsAPILoader.load();

    this.googleMapContainer = this.mapWrapper.nativeElement;
    const styledMapType = new google.maps.StyledMapType(MAP_STYLED_TYPE, {name: 'Search Alert Map'});

    this.googleMap = new google.maps.Map(this.googleMapContainer, {
      center: this.location,
      zoom: this.presetZoom,
      maxZoom: this.maxZoom,
      minZoom: this.minZoom,
      disableDefaultUI: true,
    });

    this.googleMap.mapTypes.set('styled', styledMapType);
    this.googleMap.setTilt(0);

    this.initSubscriptions();

    // this is a debug circle for measuring how precise is our own circle
    // const cityCircle = new google.maps.Circle({
    //   strokeColor: '#FF0000',
    //   strokeOpacity: 0.8,
    //   strokeWeight: 2,
    //   fillColor: '#FF0000',
    //   fillOpacity: 0.35,
    //   map: this.googleMap,
    //   center: this.googleMap.getCenter(),
    //   radius: this._radius
    // });
    // (window as any).setCircleWidth = ((newr) => {
    //   this._radius = newr;
    //   cityCircle.setRadius(newr);
    //   // this.handleRadius();
    // });

    setTimeout(() => this.handleZoom());
    this.initialized = true;
  }

  createCanvas(): void {
    const canvas = this.mapCanvas.nativeElement;
    this.ctx = canvas.getContext('2d');
  }

  initSubscriptions(): void {
    const mapDragStart$ = GmapsUtils.observableFromEvent(this.googleMap, 'dragstart')
      .pipe(map(() => true));
    const mapDragEnd$ = GmapsUtils.observableFromEvent(this.googleMap, 'dragend')
      .pipe(map(() => false));

    this.mapCenterChange$ = GmapsUtils.observableFromEvent(this.googleMap, 'center_changed');
    this.mapZoom$ = GmapsUtils.observableFromEvent(this.googleMap, 'zoom_changed');
    this.mapLoaded$ = GmapsUtils.observableFromEvent(this.googleMap, 'idle').pipe(take(1));
    this.mapDrag$ = merge(mapDragStart$, mapDragEnd$);

    this.subscriptions.add(this.mapCenterChange$
      .pipe(
        debounceTime(300)
      )
      .subscribe(() => {
        this._location = this.googleMap.getCenter().toJSON();
        this.locationChange.emit(this._location);
      }));

    this.subscriptions.add(this.mapLoaded$
      .subscribe(() => {
        this._location = this.googleMap.getCenter().toJSON();
        this.locationChange.emit(this._location);
      }));

    this.subscriptions.add(this.mapZoom$.subscribe(() => {
      if (this.doNotHandleZoom) {
        this.doNotHandleZoom = false;
        return;
      }
      this.handleZoom();
    }));
  }

  bestRadiusForZoomLevel(zoom: number, lat: number, mapSize: number, padding: number): ZoomAndRadius {
    if (this.schema === 'smaller') {
      return bestRadiusForZoomLevelInSmallerScheme(zoom, lat, mapSize, padding);
    } else {
      return bestRadiusForZoomLevel(zoom, lat, mapSize, padding);
    }
  }

  handleZoom(): void {
    this.fitCanvas();
    const bestRadius = this.bestRadiusForZoomLevel(
      this.googleMap.getZoom(),
      this.location.lat,
      this.mapDimension,
      this.padding
    );

    this._radius = bestRadius.radius;
    this.radiusChange.emit(this.radius);
    this.zoomChange.emit(bestRadius.zoom);
    this.drawCircle(bestRadius.radiusPx);
  }

  handleRadius(): void {
    this.fitCanvas();
    const bestZoom = bestZoomLevelForRadius(
      this._radius,
      this.location.lat,
      this.mapDimension,
      this.padding
    );

    if (bestZoom.zoom !== this.googleMap.getZoom()) {
      this.doNotHandleZoom = true;
      this.googleMap.setZoom(bestZoom.zoom);
    }

    this.drawCircle(bestZoom.radiusPx);
  }

  fitCanvas(): void {
    const canvas = this.ctx.canvas;
    canvas.width = this.googleMapContainer.clientWidth;
    canvas.height = this.googleMapContainer.clientHeight;
    canvas.style.width = `${canvas.width}px`;
    canvas.style.height = `${canvas.height}px`;
    this.googleMap.setOptions({ maxZoom: this.maxZoom });
  }

  drawCircle(radiusPx: number): void {
    const canvas = this.ctx.canvas;
    const center = {x: canvas.width / 2, y: canvas.height / 2};

    // clearing canvas
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    // preparing gradient
    const gradient = this.ctx.createRadialGradient(
      center.x,
      center.y,
      0,
      center.x,
      center.y,
      radiusPx
    );

    // TODO: refactor rgba to hsla
    gradient.addColorStop(0.66, 'hsla(174, 92%, 45%, 0)');
    gradient.addColorStop(0.999, 'hsla(174, 92%, 45%, 0.67)');
    gradient.addColorStop(1.000, 'hsla(0, 0%, 0%, 0)');

    // filling gradient
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.fillRect(
      center.x - radiusPx,
      center.y - radiusPx,
      radiusPx * 2,
      radiusPx * 2
    );
    this.ctx.stroke();

    // filling point
    this.ctx.fillStyle = 'hsla(174, 92%, 45%, 0.4)';
    this.ctx.beginPath();
    this.ctx.arc(center.x, center.y, 6, 0, Math.PI * 2);
    this.ctx.fill();
  }
}
