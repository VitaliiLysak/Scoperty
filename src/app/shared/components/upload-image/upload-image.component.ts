import {
  Component,
  EventEmitter,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: [
    './upload-image.component.css',
  ],
})
export class UploadImageComponent {
  @Output() upload: EventEmitter<void> = new EventEmitter<void>();

  public _name = 'upload-image';

  public onUpload(): void {
    this.upload.emit();
  }
}
