import {
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.css']
})
export class TooltipComponent {
  @Input() tooltipText: string;
  @Input() direction: string;
  @Input() page: string;
  @Input() bgColor: string;

  public _name: string = 'tooltip';
}
