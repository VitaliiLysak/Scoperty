import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-map-controls',
  templateUrl: './map-controls.component.html',
  styleUrls: [
    './map-controls.component.css',
  ],
})
export class MapControlsComponent {
  @Input()
  zoomInEnabled: boolean;

  @Input()
  zoomOutEnabled: boolean;

  @Output()
  zoomIn: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  zoomOut: EventEmitter<void> = new EventEmitter<void>();

  public _name: string = 'map-controls';

  public onZoomIn(): void {
    this.zoomIn.emit();
  }

  public onZoomOut(): void {
    this.zoomOut.emit();
  }
}
