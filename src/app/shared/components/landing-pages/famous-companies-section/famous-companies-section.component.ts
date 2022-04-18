import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-famous-companies-section',
  templateUrl: './famous-companies-section.component.html',
  styleUrls: ['./famous-companies-section.component.css']
})
export class FamousCompaniesSectionComponent {
  @Input()
  @HostBinding('class.enable-shadow')
  shadowEnabled: boolean = false;
}
