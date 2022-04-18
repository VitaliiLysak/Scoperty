import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { AboutRoutingModule } from './about-routing.module';
import { FounderComponent } from './components/founder/founder.component';
import { FoundersComponent } from './components/founders/founders.component';
import { AboutComponent } from './pages/about/about.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    AboutRoutingModule,
    SharedModule,
  ],
  declarations: [
    AboutComponent,
    FounderComponent,
    FoundersComponent,
  ],
  exports: [
    AboutComponent,
  ],
})
export class AboutModule {
}
