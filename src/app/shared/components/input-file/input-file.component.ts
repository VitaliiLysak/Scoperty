import {
  Component,
  Input,
  Output,
  ElementRef,
  EventEmitter,
  ViewChild,
  OnDestroy,
} from '@angular/core';

@Component({
  selector: 'app-input-file',
  templateUrl: './input-file.component.html',
  styleUrls: ['./input-file.component.css'],
})
export class InputFileComponent implements OnDestroy {
  @Input() accept: string;
  @Input() label: string;
  @Input() buttonName: string = 'Datei aussuchen';
  @Input() showFileName: boolean = true;
  @Input() buttonType: string = 'default';
  @Input() mode: 'mobile-column' | 'default' = 'default';
  @Input() mobileMaxWidth = false;

  @Output() change: EventEmitter<File> = new EventEmitter();

  @ViewChild('fileInput') fileInput: ElementRef;

  @Input() fileName: string = 'Datei ist nicht ausgewählt';

  ngOnDestroy(): void {
    this.change.emit(null);
  }

  onClick(): void {
    this.fileInput.nativeElement.click();
  }

  onChange(event: Event): void {
    event.stopPropagation();
    const file: File = (event.target as HTMLInputElement).files[0];
    this.fileName = file.name;
    this.change.emit(file);
  }
}
