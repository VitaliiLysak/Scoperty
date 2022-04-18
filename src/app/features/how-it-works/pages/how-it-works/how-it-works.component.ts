import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SELLING_STATUS_EXPLANATIONS, SellingStatusExplanation, } from './how-it-works.model';
import { SHARED_ROUTES_NAMES } from '../../../../app.constants';
import { AnalyticsService } from '../../../../core/services/analytics/analytics.service';
import { CreateNewCityAlert } from '../../../../core/models/properties-repository.model';
import { PropertiesRepositoryService } from '../../../../core/services/properties-repository.service';
import { AbstractPageComponent } from '../../../../shared/components/abstract-page/abstract-page.component';
import { templateStatusToFrontend } from '../../../../shared/utils/deserializator.util';
import { markFormGroupControlsAsDirty } from '../../../../shared/utils/form-group.util';
import { isNullOrUndefined } from '../../../../shared/utils/null-or-undefined.util';
import { isMobileDevice$ } from '../../../../shared/utils/responsive.util';
import { DomSanitizer } from '@angular/platform-browser';

interface UserData {
  email:   string;
  zipCode: string;
}

const ANCHORS = {
  availabilityBlock: 'availability',
  advantagesBlock: 'advantages',
  faqBlock: 'faq',
};

enum Feedback {
  Success = 'success',
  Failure = 'failure',
}

@Component({
  selector: 'app-how-it-works',
  templateUrl: './how-it-works.component.html',
  styleUrls: ['./how-it-works.component.css']
})
export class HowItWorksComponent extends AbstractPageComponent {
  protected _url: string = `/${SHARED_ROUTES_NAMES.HOWITWORKS}`;
  protected _anchorAliases: Map<string, string> = new Map(Object.entries(ANCHORS));

  public _name: string = 'how-it-works';
  public linkToDataProtection: string = `/${SHARED_ROUTES_NAMES.DATAPROTECTION}`;

  public isMobileDevice$ = isMobileDevice$;

  public userTargetTabs: any = {
    buy: true,
    sell: false
  };

  public userData: UserData;
  public userDataForm: FormGroup;

  private showFeedback: Feedback;

  private sellingStatusExplanations: SellingStatusExplanation[] = SELLING_STATUS_EXPLANATIONS;
  public sellingStatusExplanationRows: number[] = [ 0, 1 ];

  get shouldShowAnyFeedback(): boolean {
    return !isNullOrUndefined(this.showFeedback);
  }

  get shouldShowSuccessFeedback(): boolean {
    return this.showFeedback === Feedback.Success;
  }

  public get email() {
    return this.userDataForm.get('email');
  }

  public get zipCode() {
    return this.userDataForm.get('zipCode');
  }

  private _setSettings(): void {
    this.userData = {
      email: '',
      zipCode: '',
    };
  }

  private _initForm(): void {
    this._setSettings();

    this.userDataForm = new FormGroup({
      'email': new FormControl(this.userData.email, [
        Validators.required,
        Validators.email
      ]),
      'zipCode': new FormControl(this.userData.zipCode, [
        Validators.required,
        Validators.pattern('[0-9]{5}'),
        Validators.maxLength(5),
        this.checkZipCodeValidator,
      ]),
    });
  }

  private checkZipCodeValidator(control: FormControl): {[s: string]: boolean} {
    if (control.value.length && control.value.length > 5) return {'quantityErr': true};
    return null;
  }

  constructor(
    actRoute: ActivatedRoute,
    router: Router,
    sanitizer: DomSanitizer,
    private analyticsService: AnalyticsService,
    private propertiesRepositoryService: PropertiesRepositoryService,
  ) {
    super(actRoute, router);

    this.sellingStatusExplanations = this.sellingStatusExplanations
      .map(explanations => ({
        text: sanitizer.bypassSecurityTrustHtml(explanations.text as string),
        sellingStatus: explanations.sellingStatus,
        title: explanations.title,
      }));

    this._initForm();
  }

  sendLeadForm(): void {
    if (this.userDataForm.invalid) {
      markFormGroupControlsAsDirty(this.userDataForm);
      return;
    }

    const { email, zipCode } = this.userData;
    if (this.userDataForm.valid) {
      const data: CreateNewCityAlert = {
        email: email.toLowerCase(),
        zip_code: zipCode,
      };
      const createNewCityAlert$ = this.propertiesRepositoryService.createNewCityAlert(data);
      createNewCityAlert$.subscribe(() => {
        this.analyticsService.triggerFormSubmissionSuccess('howItWorksForm', 'how-it-works-page');
        this.showFeedback = Feedback.Success;
      }, () => {
        this.showFeedback = Feedback.Failure;
      });
    }
  }

  public changeActiveTab(status: string): void {
    if (status === 'buy') this.userTargetTabs = { buy: true, sell: false };
    else if (status === 'sell') this.userTargetTabs = { buy: false, sell: true };
  }

  public getSellingStatusName(sellingStatusExplanation: SellingStatusExplanation): string {
    const { sellingStatus } = sellingStatusExplanation;
    return sellingStatus === 'Active'
      ? 'Alle Immobilien mit aktuellen Schätzwerten'
      : templateStatusToFrontend(sellingStatus);
  }

  public sellingStatusExplanationsForRow(row: number): SellingStatusExplanation[] {
    const numberOfSellingStatusExplanationRows = this.sellingStatusExplanationRows.length;
    const start = row * numberOfSellingStatusExplanationRows;
    return this.sellingStatusExplanations.slice(start, start + numberOfSellingStatusExplanationRows);
  }
}
