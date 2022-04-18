import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

export type ProgressBarColor = 'green';
export type ProgressBarBackgroundColor = 'dark';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: [
    './progress-bar.component.css',
  ],
})
export class ProgressBarComponent implements OnChanges {
  @Input()
  color: ProgressBarColor = 'green';

  @Input()
  backgroundColor: ProgressBarBackgroundColor = 'dark';

  @Input()
  value: number = 0.0;

  @Input()
  numberOfSections: number = 5;

  public _name: string = 'progress-bar';

  public separators: number[] = [];

  public get progressCssStyle(): { [ cssProperty: string ]: string } {
    const width = `${ this.value * 100 }%`;
    return { width };
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.configureSeparators();
  }

  private configureSeparators(): void {
    const length = this.numberOfSections > 0 ? this.numberOfSections - 1 : 0;
    this.separators = Array.from({ length }, (value, index) => index);
  }
}
