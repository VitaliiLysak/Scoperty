import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { HowItWorksRoutingModule } from './how-it-works-routing.module';

import { HowItWorksFaqComponent } from './components/how-it-works-faq/how-it-works-faq.component';
import { HowItWorksFeedbackComponent } from './components/how-it-works-feedback/how-it-works-feedback.component';
import { HowItWorksComponent } from './pages/how-it-works/how-it-works.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,

    HowItWorksRoutingModule,
    SharedModule
  ],
  declarations: [
    HowItWorksComponent,
    HowItWorksFaqComponent,
    HowItWorksFeedbackComponent,
  ],
  exports: [
    HowItWorksComponent
  ]
})
export class HowItWorksModule {
}
