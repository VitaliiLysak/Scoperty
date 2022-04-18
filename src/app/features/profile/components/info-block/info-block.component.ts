import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { SHARED_ROUTES_NAMES } from '../../../../app.constants';

@Component({
  selector: 'app-info-block',
  templateUrl: './info-block.component.html',
  styleUrls: ['./info-block.component.css']
})
export class InfoBlockComponent {
  @Input() buttonText: string;

  public _name: string = 'info-block';

  constructor(private router: Router) {}

  public navigateToMapPage(): void {
    this.router.navigate(
      [ `/${ SHARED_ROUTES_NAMES.MAP }` ],
      { queryParamsHandling: 'merge' }
    );
  }
}
