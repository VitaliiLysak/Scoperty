import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-street-view',
  templateUrl: './street-view.component.html',
  styleUrls: ['./street-view.component.css']
})
export class StreetViewComponent implements OnInit {

  @Input() mods: any = {};
  @Input() position: any = {};
  @Input() panControl: boolean = false;
  @Input() zoomControl: boolean = true;
  @Input() addressControl: boolean = false;
  @Input() fullscreenControl: boolean = false;
  @Input() linksControl: boolean = true;
  @Input() enableCloseButton: boolean = false;
  @Input() motionTracking: boolean = false;
  @Input() motionTrackingControl: boolean = false;

  public _name: string = 'street-view';

  constructor() { }

  ngOnInit() {
    this.initPano();
  }

  initPano() {
    // Note: constructed panorama objects have visible: true
    // set by default.
    const panorama = new google.maps.StreetViewPanorama(
      document.getElementById('pano'), {
        position: this.position,
        panControl: this.panControl,
        zoomControl: this.zoomControl,
        addressControl: this.addressControl,
        fullscreenControl: this.fullscreenControl,
        linksControl: this.linksControl,
        enableCloseButton: this.enableCloseButton,
        motionTracking: this.motionTracking,
        motionTrackingControl: this.motionTrackingControl,
      });
  }

}
