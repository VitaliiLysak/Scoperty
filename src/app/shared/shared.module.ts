import {
  CommonModule,
  DecimalPipe,
} from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { TextMaskModule } from 'angular2-text-mask';
import { SortablejsModule } from 'angular-sortablejs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';
import { SelectModule } from 'ng2-select';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { ModalModule } from 'ngx-bootstrap';
import { NguCarouselModule } from '@ngu/carousel';
import { NouisliderModule } from 'ng2-nouislider';

import { AlertComponent } from './components/alert/alert.component';
import { BaseModalComponent } from './components/base-modal/base-modal.component';
import { BaseModalActionsComponent } from './components/base-modal/base-modal-actions/base-modal-actions.component';
import { BaseModalBodyDirective } from './components/base-modal/base-modal-body.directive';
import { BaseModalFooterDirective } from './components/base-modal/base-modal-footer.directive';
import { BaseModalHeaderDirective } from './components/base-modal/base-modal-header.directive';
import { BaseModalIconDirective } from './components/base-modal/base-modal-icon.directive';
import { BaseModalMessageDirective } from './components/base-modal/base-modal-message.directive';
import { BaseModalTitleDirective } from './components/base-modal/base-modal-title.directive';
import { AccordionComponent } from './components/accordion/accordion.component';
import { ExplanationComponent } from './components/explanation/explanation.component';
import {
  AnchorComponent,
  ButtonComponent,
} from './components/button/button.component';
import { IconAnchorComponent } from './components/icon-button/icon-anchor.component';
import { BadgeComponent } from './components/badge/badge.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { DecisionDialogComponent } from './components/decision-dialog/decision-dialog.component';
import { EditableTextComponent } from './components/editable-text/editable-text.component';
import { ExpandablePanelComponent } from './components/expandable-panel/expandable-panel.component';
import { FindPropertyComponent } from './components/find-property/find-property.component';
import { FormFieldComponent } from './components/form-field/form-field.component';
import { FormFieldErrorMessageDirective } from './components/form-field/form-field-error-message.directive';
import { FormFieldSuffixDirective } from './components/form-field/form-field-suffix.directive';
import { InfoMessageComponent } from './components/info-message/info-message.component';
import { MobileNavbarComponent } from './components/mobile-navbar/mobile-navbar.component';
import { InputComponent } from './components/input/input.component';
import { InputRequirementsComponent } from './components/input-requirements/input-requirements.component';
import { LoadingIndicatorComponent } from './components/loading-indicator/loading-indicator.component';
import { MessageComponent } from './components/message/message.component';
import { PanelComponent } from './components/accordion/panel/panel.component';
import { PanelContentDirective } from './components/accordion/panel/panel.content.directive';
import { PanelTitleDirective } from './components/accordion/panel/panel.title.directive';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { PasswordInputDirective } from './components/input/password-input.directive';
import { ObjectSliderComponent } from './components/object-slider/object-slider.component';
import { RadioButtonComponent } from './components/radio-button/radio-button.component';
import { RadioGroupComponent } from './components/radio-group/radio-group.component';
import { RatioComponent } from './components/ratio/ratio.component';
import { SellingStatusComponent } from './components/selling-status/selling-status.component';
import { SellingStatusTagComponent } from './components/selling-status-tag/selling-status-tag.component';
import { SettingsItemComponent } from './components/settings-item/settings-item.component';
import { SwitchComponent } from './components/switch/switch.component';
import { TagComponent } from './components/tag/tag.component';
import { UploadImageComponent } from './components/upload-image/upload-image.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { ImageComponent } from './components/image/image.component';
import { NumberInputComponent } from './components/number-input/number-input.component';
import { StringInputComponent } from './components/string-input/string-input.component';
import { SelectComponent } from './components/select/select.component';
import { SelectInputComponent } from './components/select-input/select-input.component';
import { ObjectSliderItemComponent } from './components/object-slider/object-slider-item/object-slider-item.component';
import { SpoilerComponent } from './components/spoiler/spoiler.component';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import { UserDataFullFormComponent } from './components/user-data-full-form/user-data-full-form.component';
import { MarkerDetailDataComponent } from './components/marker-detail-data/marker-detail-data.component';
import { MarkerDetailDataDescriptionComponent } from './components/marker-detail-data-description/marker-detail-data-description.component';
import { MarkerDetailDataEquipmentComponent } from './components/marker-detail-data-equipment/marker-detail-data-equipment.component';
import { DiscoverMarketValuePopupComponent } from './components/discover-market-value-popup/discover-market-value-popup.component';
import {
  MarkerDetailEstimatedPriceTrendComponent
} from './components/marker-detail-estimated-price-trend/marker-detail-estimated-price-trend.component';
import { MarkerDetailGalleryComponent } from './components/marker-detail-gallery/marker-detail-gallery.component';
import {
  MarkerDetailGalleryViewWindowComponent
} from './components/marker-detail-gallery/marker-detail-gallery-view-window/marker-detail-gallery-view-window.component';
import {
  MarkerDetailDataEnergyInfoComponent
} from './components/marker-detail-data-energy-info/marker-detail-data-energy-info.component';
import {
  MarkerDetailGalleryImageComponent,
} from './components/marker-detail-gallery/marker-detail-gallery-image/marker-detail-gallery-image.component';
import { MarkerDetailStatisticsComponent } from './components/marker-detail-statistics/marker-detail-statistics.component';
import { MarkerDetailDataPlaceComponent } from './components/marker-detail-data-place/marker-detail-data-place.component';
import { MarkerDetailMakeMeMoveComponent } from './components/marker-detail-make-me-move/marker-detail-make-me-move.component';
import { FavouriteComponent } from './components/favourite/favourite.component';
import { SearchPlaceComponent } from './components/search-place/search-place.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { CommonErrorComponent } from './components/common-error/common-error.component';
import { GenericErrorAlertComponent } from './components/generic-error-alert/generic-error-alert.component';
import { CoverDataBlockComponent } from './components/cover-data-block/cover-data-block.component';
import { FiltersComponent } from './components/filters/filters.component';
import {
  MarkerDetailContactMeWindowComponent
} from './components/marker-detail-contact-me-window/marker-detail-contact-me-window.component';
import { InformationModalComponent } from './components/information-modal/information-modal.component';
import { InputRequirementDirective } from './components/input-requirements/input-requirement.directive';
import { ResponsiveImageComponent } from './components/responsive-image/responsive-image.component';
import { ResponsiveBackgroundImageComponent } from './components/responsive-image/responsive-background-image.component';
import { DesktopVideoComponent } from './components/desktop-video/desktop-video.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { PropertyTypeTagComponent } from './components/property-type-tag/property-type-tag.component';
import { StepperHeaderComponent } from './components/stepper-header/stepper-header.component';
import { StepperHeaderTabDirective } from './components/stepper-header/stepper-header-tab.directive';
import { StepperHeaderTabComponent } from './components/stepper-header/stepper-header-tab/stepper-header-tab.component';
import { TabsHeaderComponent } from './components/tabs-header/tabs-header.component';
import { TabsHeaderTabDirective } from './components/tabs-header/tabs-header-tab.directive';
import { TabsHeaderTabComponent } from './components/tabs-header/tabs-header-tab/tabs-header-tab.component';
import { ResponsiveVideoComponent } from './components/responsive-video/responsive-video.component';
import { WormImageComponent } from './components/worm-image/worm-image.component';
import { YoutubeVideoComponent } from './components/youtube-video/youtube-video.component';
import { VideoComponent } from './components/video/video.component';
import { DirectivesModule } from './directives/directives.module';
import { ControlModule } from './components/controls/controls.module';
import { PipesModule } from './pipes/pipes.module';
import { ApplyCssClassesService } from './services/apply-css-classes.service';
import { LogoComponent } from './components/logo/logo.component';
import { ValuatePropertyComponent } from './components/valuate-property/valuate-property.component';
import { ValuatePropertyGaugeComponent } from './components/valuate-property-gauge/valuate-property-gauge.component';
import { IconsModule } from './icons/icons.module';
import { getQueryParams, QUERY_PARAMS } from './utils/get-query-params.util';
import { getTrackingQueryParams, TRACKING_QUERY_PARAMS } from './utils/get-tracking-query-params.util';
import { InputFileComponent } from './components/input-file/input-file.component';
import { DatepickerComponent } from './components/datepicker/datepicker.component';
import { SearchAlertMapComponent } from './components/search-alert-map/search-alert-map.component';
import { SearchRadiusControlComponent } from './components/search-radius-control/search-radius-control.component';
import { GroupedRadioButtonsComponent } from './components/grouped-radio-buttons/grouped-radio-buttons.component';

const ENTRY_COMPONENTS: any[] = [
  ConfirmationDialogComponent,
  DecisionDialogComponent,
  MarkerDetailGalleryViewWindowComponent,
  MarkerDetailMakeMeMoveComponent,
  CommonErrorComponent,
  InformationModalComponent,
  MarkerDetailContactMeWindowComponent,
  SearchRadiusControlComponent
];

const COMPONENTS: any[] = [
  SearchAlertMapComponent,
  AlertComponent,
  BaseModalComponent,
  CheckboxComponent,
  CoverDataBlockComponent,
  DatepickerComponent,
  EditableTextComponent,
  ErrorMessageComponent,
  ExpandablePanelComponent,
  FiltersComponent,
  ImageComponent,
  NumberInputComponent,
  StringInputComponent,
  AccordionComponent,
  ExplanationComponent,
  AnchorComponent,
  ButtonComponent,
  IconAnchorComponent,
  BadgeComponent,
  FindPropertyComponent,
  InputComponent,
  PasswordInputDirective,
  InputRequirementsComponent,
  InputFileComponent,
  FormFieldComponent,
  FormFieldErrorMessageDirective,
  FormFieldSuffixDirective,
  FavouriteComponent,
  MessageComponent,
  MobileNavbarComponent,
  LoadingIndicatorComponent,
  SearchPlaceComponent,
  SearchBarComponent,
  InfoMessageComponent,
  PanelComponent,
  ObjectSliderComponent,
  RadioButtonComponent,
  RadioGroupComponent,
  RatioComponent,
  ResponsiveImageComponent,
  ResponsiveBackgroundImageComponent,
  DiscoverMarketValuePopupComponent,
  DesktopVideoComponent,
  SelectComponent,
  SelectInputComponent,
  SellingStatusComponent,
  SellingStatusTagComponent,
  SettingsItemComponent,
  ObjectSliderItemComponent,
  ProgressBarComponent,
  PropertyTypeTagComponent,
  SpoilerComponent,
  SwitchComponent,
  TooltipComponent,
  TagComponent,
  UploadImageComponent,
  UserDataFullFormComponent,
  SearchPlaceComponent,
  ResponsiveVideoComponent,
  WormImageComponent,
  YoutubeVideoComponent,
  VideoComponent,
  LogoComponent,
  GenericErrorAlertComponent,

  StepperHeaderComponent,
  StepperHeaderTabDirective,
  StepperHeaderTabComponent,

  TabsHeaderComponent,
  TabsHeaderTabDirective,
  TabsHeaderTabComponent,

  MarkerDetailDataComponent,
  MarkerDetailDataDescriptionComponent,
  MarkerDetailDataEquipmentComponent,
  MarkerDetailEstimatedPriceTrendComponent,
  MarkerDetailDataEnergyInfoComponent,
  MarkerDetailGalleryComponent,
  MarkerDetailGalleryImageComponent,
  MarkerDetailGalleryViewWindowComponent,
  MarkerDetailStatisticsComponent,
  MarkerDetailDataPlaceComponent,
  MarkerDetailMakeMeMoveComponent,
  MarkerDetailContactMeWindowComponent,

  ValuatePropertyComponent,
  ValuatePropertyGaugeComponent,
  GroupedRadioButtonsComponent,
];

const DIRECTIVES: any[] = [
  BaseModalActionsComponent,
  BaseModalBodyDirective,
  BaseModalFooterDirective,
  BaseModalHeaderDirective,
  BaseModalIconDirective,
  BaseModalMessageDirective,
  BaseModalTitleDirective,
  InputRequirementDirective,
  FormFieldErrorMessageDirective,
  PanelContentDirective,
  PanelTitleDirective,
];

const MODULES: any[] = [
  DirectivesModule,
  IconsModule,
  PipesModule,
  ControlModule,
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    SelectModule,
    SortablejsModule.forRoot({animation: 200}),
    ChartsModule,
    NguCarouselModule,
    NouisliderModule,
    BootstrapModalModule.forRoot({container: document.body}),
    ModalModule.forRoot(),
    NgbModule.forRoot(),
    TextMaskModule,

    ...MODULES,
  ],
  declarations: [
    ...COMPONENTS,
    ...ENTRY_COMPONENTS,
    ...DIRECTIVES,
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS,
  ],
  exports: [
    ...COMPONENTS,
    ...ENTRY_COMPONENTS,
    ...DIRECTIVES,
    ...MODULES,
  ],
  providers: [
    DecimalPipe,
    ApplyCssClassesService,
    {
      provide: QUERY_PARAMS,
      useValue: getQueryParams(),
    },
    {
      provide: TRACKING_QUERY_PARAMS,
      useValue: getTrackingQueryParams(),
    },
  ],
})
export class SharedModule {
}
