import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgxActiveModal } from 'ngx-multi-modal';

import {
  FIELDS_NOT_SENT_TO_BE,
  OnBoardingStep,
  STEP_ITEMS,
  STEPS_FINAL,
  STEPS_OF_FIRST_STEP,
  STEPS_OF_SECOND_STEP,
  STEPS_OF_THIRD_STEP,
  STEPS_THAT_CHECK_USER_LOGGED_IN,
  STEPS_WHERE_CONFIRM_WINDOW_SHOULD_NOT_SHOW,
  STEPS_WHERE_NAV_BOX_IS_EDITABLE,
  STEPS_WHERE_NAV_BOX_IS_HIDDEN,
} from '../../../../core/models/scoperty-plus-onboard.model';
import { isNullOrUndefined } from '../../../../shared/utils/null-or-undefined.util';
import { ScopertyPlusEditFieldsNavComponent } from '../scoperty-plus-edit-fields-nav/scoperty-plus-edit-fields-nav.component';
import { AuthService } from '../../../../core/services/auth.service';
import { ScopertyPlusOnboardService } from '../../scoperty-plus-onboard.service';
import { filter, take } from 'rxjs/operators';
import { MetersToKilometersPipe } from '../../../../shared/pipes/meters-to-kilometers.pipe';
import {
  isMobileDevice$,
  isTabletDeviceLandscaped,
  isTabletDeviceLandscaped$
} from '../../../../../app/shared/utils/responsive.util';
import { QueryParamsService } from '../../../../core/services/query-params.service';

@Component({
  selector: 'app-scoperty-plus-onboard',
  templateUrl: './scoperty-plus-onboard.component.html',
  styleUrls: ['./scoperty-plus-onboard.component.css'],
  providers: [MetersToKilometersPipe]
})
export class ScopertyPlusOnboardComponent implements OnInit, AfterViewInit {

  @Input() formContent: OnBoardingStep[] = STEP_ITEMS;

  @Output() readonly formSubmit: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(ScopertyPlusEditFieldsNavComponent) navComponent: ScopertyPlusEditFieldsNavComponent;

  _activeStepIndex: number = 9;
  fallbackStepIndex: number = null;
  formData: any;
  stepItems: Array<any>;
  masterForm: Array<FormGroup> = [];
  propertiesCount: number = 0;
  isMobileDevice$ = isMobileDevice$;
  isTabletDeviceLandscaped$ = isTabletDeviceLandscaped$;
  presetItems: any[] = [];
  isWhiteBackground: boolean = false;

  get activeStepIndex() {
    return this._activeStepIndex;
  }

  set activeStepIndex(stepIndex: number) {
    if (isTabletDeviceLandscaped() && this._activeStepIndex === 4 && stepIndex === 5) {
      this._activeStepIndex = 14;
      this.fallbackStepIndex = 5;
    } else {
      this._activeStepIndex = stepIndex;
    }

    if (STEPS_THAT_CHECK_USER_LOGGED_IN.includes(stepIndex) && this.authService.isUserLoggedIn()) {
      this.redirectUserToLoggedIn();
    }
  }

  get isFirstStep(): boolean {
    return STEPS_OF_FIRST_STEP.includes(this.activeStepIndex);
  }

  get isSecondStep(): boolean {
    return STEPS_OF_SECOND_STEP.includes(this.activeStepIndex);
  }

  get isThirdStep(): boolean {
    return STEPS_OF_THIRD_STEP.includes(this.activeStepIndex);
  }

  get isMobileNavStep(): boolean {
    return this.activeStepIndex === 14;
  }

  get isFinalSubstep(): boolean {
    return STEPS_FINAL.includes(this.activeStepIndex);
  }

  get navEditable(): boolean {
    return STEPS_WHERE_NAV_BOX_IS_EDITABLE.includes(this.activeStepIndex);
  }

  get confirmOnClose(): boolean {
    return !STEPS_WHERE_CONFIRM_WINDOW_SHOULD_NOT_SHOW.includes(this.activeStepIndex);
  }

  get email(): string {
    return this.masterForm[6].controls['email'].value;
  }

  get hideNavBarBox(): boolean {
    return STEPS_WHERE_NAV_BOX_IS_HIDDEN.includes(this.activeStepIndex)
      || (isTabletDeviceLandscaped() && this.activeStepIndex !== 14);
  }

  set email(email: string) {
    this.masterForm[6].controls['email'].setValue(email);
  }

  constructor(
    private readonly formBuilder: FormBuilder,
    private scopertyPlusOnboardService: ScopertyPlusOnboardService,
    private authService: AuthService,
    private metersToKilometersPipe: MetersToKilometersPipe,
    private queryParamsService: QueryParamsService,
    private activeModal: NgxActiveModal,
  ) {}

  ngOnInit() {
    this.showWhiteBackground();

    (window as any ).onboard = this;
    this.stepItems = this.formContent;

    this.scopertyPlusOnboardService.presetFormContents$
      .pipe(
        filter(data => this.scopertyPlusOnboardService.hasSavedForm ? !!data : true),
        take(1),
      )
      .subscribe((formValue) => {
        if (isNullOrUndefined(formValue)) {
          formValue = {activeStepIndex: 0, formData: {}, fallbackStepIndex: null};
        }

        this.stepItems.forEach((step, i) => {
          if (isNullOrUndefined(step.data)) {
            this.masterForm.push(null);
          } else {
            const presetItems = Object.keys(step.data)
              .reduce((acc, key) => {
                acc[key] = formValue.formData[key] || step.data[key].value || '';
                return acc;
              }, {});

            // holds all form groups
            this.masterForm.push(this.buildForm(step.data, presetItems));

            if (i < formValue.activeStepIndex) {
              this.presetItems[i] = presetItems;
            }
          }
        });
        setTimeout(() => {
          this.activeStepIndex = formValue.activeStepIndex;
          this.fallbackStepIndex = formValue.fallbackStepIndex;
        });
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.presetItems.forEach((item, i) => this.setNavItems(item, i)));
  }

  onDismiss(): void {
    this.activeModal.dismiss();
  }

  showWhiteBackground(): void {
    if (this.queryParamsService.hasOpenScopertyPlusOnboard()) {
      this.isWhiteBackground = true;
    }
  }

  backdropClick() {
    this.activeModal.dismiss();
  }

  onFormSubmit(): void {
    this.purgeSavedFormContents();
    this.formSubmit.emit(this.formData);
  }

  onSubAcquire(sub: string): void {
    this.masterForm[8].controls['sub'].setValue(sub);
  }

  buildForm(currentFormContent: any, presetValues: any): FormGroup {
    const formDetails = Object.keys(currentFormContent).reduce(
      (obj, key) => {
        obj[key] = [presetValues[key], this.getValidators(currentFormContent[key])];

        return obj;
      },
      {}
    );

    return this.formBuilder.group(formDetails);
  }

  getValidators(formField: any): Validators {
    const fieldValidators = Object.keys(formField.validations).map(validator => {
      if (validator === 'required') {
        return Validators[validator];
      } else {
        return Validators[validator](formField.validations[validator]);
      }
    });

    return fieldValidators;
  }

  setCountProperties(propertiesCount: number) {
    this.propertiesCount = propertiesCount;
  }

  goToNextStep(step: number = this.fallbackStepIndex): void {
    this.fallbackStepIndex = null;
    this.handleNav();

    this.activeStepIndex = !isNullOrUndefined(step) ? step : this.activeStepIndex + 1;

    this.setFormPreview();
  }

  redirectUserToLoggedIn() {
    const { sub } = this.authService.getCurrentUser().attributes;
    this.masterForm[8].controls['sub'].setValue(sub);
    this.goToNextStep(9);
  }

  handleNav() {
    if (this.masterForm[this.activeStepIndex]) {
      const values = this.masterForm[this.activeStepIndex].value;
      this.setNavItems(values, this.activeStepIndex);
    }
  }

  setNavItems(values, stepIndex) {
    const elements: ScopertyPlusEditFieldsNavComponent.Element[] = [];
    switch (stepIndex) {
      case 0: {
        elements.push({name: 'Art', data: values.property_type === 'apartment' ? 'Wohnung' : 'Haus'});
        break;
      }
      case 1: {
        elements.push({name: 'Wohnfläche', data: `${values.living_area} m\u00B2`});
        break;
      }
      case 2: {
        elements.push({name: 'Zimmer', data: `ab ${values.number_of_rooms}`});
        break;
      }
      case 3: {
        elements.push({name: 'Ausstattung', data: `${this.getHouseFeatures(values).join(', ')}`});
        break;
      }
      case 4: {
        elements.push({
          name: 'Stadt',
          data: `${values.address_city}, Radius\xa0${this.metersToKilometersPipe.transform(values.radius, false)}`
        });
        break;
      }
    }

    this.navComponent.pushSection(stepIndex.toString(), elements);
  }

  getHouseFeatures(formValue: {[key: string]: boolean}) {
    const chosenKeys =  Object.keys(formValue)
      .filter(key => formValue[key]);

    return !chosenKeys.length
      ? ['-']
      : chosenKeys.map(key => {
        switch (key) {
          case 'has_balcony': {
            return 'Balkon';
          }
          case 'has_garden': {
            return 'Garten';
          }
          case 'has_terrace': {
            return 'Terrasse';
          }
        }
      });
  }

  sectionRewind(section: string) {
    const stepIndex = parseInt(section, 10);

    if (this.activeStepIndex > 5) { // steps after property search
      this.fallbackStepIndex = 5;
    } else {
      this.fallbackStepIndex = this.activeStepIndex;
    }

    this.activeStepIndex = stepIndex;
  }

  setFormPreview(): void {
    this.formData = this.masterForm.reduce(
      (masterForm, currentForm) => ({ ...masterForm, ...(currentForm ? currentForm.value : {}) }),
      {}
    );

    this.scopertyPlusOnboardService.saveFormContents({
      fallbackStepIndex: this.fallbackStepIndex,
      activeStepIndex: this.activeStepIndex,
      formData: this.formData
    });
  }

  sendFormData(): void {
    const multiPartFormData = new FormData();
    for (const key in this.formData) {
      if (this.formData.hasOwnProperty(key) && !FIELDS_NOT_SENT_TO_BE.includes(key)) {
        if (key === 'mortgage_certificate') {
          const blob = new Blob([this.formData[key]], {type: this.formData.mortgage_certificate_type});
          multiPartFormData.append(key, blob, this.formData.mortgage_certificate_name);
        } else {
          multiPartFormData.append(key, this.formData[key]);
        }
      }
    }
    this.scopertyPlusOnboardService.sendFormData(multiPartFormData);
  }

  purgeSavedFormContents() {
    this.scopertyPlusOnboardService.purgeFormContents();
  }
}
