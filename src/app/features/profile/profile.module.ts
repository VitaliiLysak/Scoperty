import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgxMultiModalModule } from 'ngx-multi-modal';

import { ProfileRoutingModule } from './profile-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { LivingAreaPipe } from '../../shared/pipes/living-area.pipe';

import { ChangeOwnerComponent } from './components/change-owner/change-owner.component';
import { ChangePrivacyComponent } from './components/change-privacy/change-privacy.component';
import { ChangeSellingStatusComponent } from './components/change-selling-status/change-selling-status.component';
import { PropertyDetailsLinkComponent } from './components/property-details-link/property-details-link.component';
import { PropertyComponent } from './components/property/property.component';
import { FavoriteItemComponent } from './components/favorite-item/favorite-item.component';
import { SearchAlertsItemComponent } from './components/search-alerts-item/search-alerts-item.component';
import { MarkerDetailContactInfoComponent } from './components/marker-detail-contact-info/marker-detail-contact-info.component';
// tslint:disable-next-line:max-line-length
import { MyPropertiesAskForSellingStatusChangeComponent } from './components/my-properties-ask-for-selling-status-change/my-properties-ask-for-selling-status-change.component';
// tslint:disable-next-line:max-line-length
import { MyPropertiesEstimatedPriceBannerComponent } from './components/my-properties-estimated-price-banner/my-properties-estimated-price-banner.component';
import { AvatarLimitComponent } from './components/avatar-limit/avatar-limit.component';
import { PropertyEditComponent } from './pages/property-edit/property-edit.component';
import { PropertyOverviewComponent } from './pages/property-overview/property-overview.component';
import { PropertySettingsComponent } from './pages/property-settings/property-settings.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ProfileIndexComponent } from './pages/profile-index/profile-index.component';
import { ChatComponent } from './pages/chat/chat.component';
import { ProfilesFavoritesComponent } from './pages/profile-favorites/profile-favorites.component';
import { MyPropertiesComponent } from './pages/my-properties/my-properties.component';
import { OffersComponent } from './pages/offers/offers.component';
import { PropertySearchAlertsComponent } from './pages/property-search-alerts/property-search-alerts.component';
import { ChangeUserPhoneComponent } from './components/change-user-phone/change-user-phone.component';
import { DeleteAccountComponent } from './components/delete-account/delete-account.component';
import { EmailUpdateComponent } from './components/email-update/email-update.component';
import { DeleteSearchTemplateComponent } from './components/delete-search-template/delete-search-template.component';
import { AskForSellingStatusService } from './services/ask-for-selling-status.service';
import { InfoBlockComponent } from './components/info-block/info-block.component';
import { MyPropertiesEstimatedValueComponent } from './components/my-properties-estimated-value/my-properties-estimated-value.component';

const COMPONENTS: any[] = [
  ProfileComponent,
  ProfileIndexComponent,
  ChatComponent,
  ProfilesFavoritesComponent,
  MyPropertiesComponent,
  OffersComponent,
  PropertySearchAlertsComponent,

  ChangeOwnerComponent,
  ChangePrivacyComponent,
  ChangeSellingStatusComponent,
  PropertyDetailsLinkComponent,
  PropertyComponent,
  FavoriteItemComponent,
  SearchAlertsItemComponent,
  MyPropertiesEstimatedValueComponent,
  PropertyEditComponent,
  PropertyOverviewComponent,
  PropertySettingsComponent,
  MarkerDetailContactInfoComponent,
  MyPropertiesEstimatedPriceBannerComponent,
  InfoBlockComponent,
];

const ENTRY_COMPONENTS: any[] = [
  AvatarLimitComponent,
  ChangeUserPhoneComponent,
  DeleteAccountComponent,
  EmailUpdateComponent,
  DeleteSearchTemplateComponent,
  MyPropertiesAskForSellingStatusChangeComponent,
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    NgxMultiModalModule.forRoot({
      backdrop: true,
      container: 'body',
      windowClass: 'ngx-multi-modal',
    }),

    ProfileRoutingModule,
    SharedModule,
  ],
  providers: [
    AskForSellingStatusService,
    LivingAreaPipe
  ],
  declarations: [
    ...COMPONENTS,
    ...ENTRY_COMPONENTS,
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS,
  ],
})
export class ProfileModule {
}
