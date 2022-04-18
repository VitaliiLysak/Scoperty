import {
  Component,
  Output,
  EventEmitter,
  Input,
  Inject,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
} from '@angular/forms';
import {
  Router,
  UrlSerializer,
} from '@angular/router';

import { ButtonColor } from '../button/button.component';
import getTrackingQueryParams from '../../utils/get-tracking-query-params.util';
import { SHARED_ROUTES_NAMES } from '../../../app.constants';
import { IFullFormRequest } from '../../../core/models/form-request.model';
import { WINDOW } from '../../../core/services/window.provider';

type Gender = 'W' | 'M';

@Component({
  selector: 'app-user-data-full-form',
  templateUrl: './user-data-full-form.component.html',
  styleUrls: [
    './user-data-full-form.component.css',
  ],
})
export class UserDataFullFormComponent {
  @Input() locationPrefix: string = '';
  @Input() buttonText: string;
  @Input() buttonColor: ButtonColor = 'primary-dark';

  @Output() userData: EventEmitter<IFullFormRequest> = new EventEmitter<IFullFormRequest>();
  @Output() dataProtectionClick: EventEmitter<void> = new EventEmitter<void>();

  public _name: string = 'user-data-full-form';

  public requestForm: FormGroup;
  public request: IFullFormRequest = {
    gender: 'W',
    firstName: '',
    secondName: '',
    email: '',
    phone: '',
  };

  public get firstName() {
    return this.requestForm.get('firstName');
  }

  public get secondName() {
    return this.requestForm.get('firstName');
  }

  public get email() {
    return this.requestForm.get('email');
  }

  public get phone() {
    return this.requestForm.get('phone');
  }

  constructor(
    private router: Router,
    private serializer: UrlSerializer,
    @Inject(WINDOW) private window: Window,
  ) {
    this.initFom();
  }

  private initFom(): void {
    this.requestForm = new FormGroup({});
  }

  public blurred(key: string, value: string): void {
    this.request[key] = value;
  }

  public created(formControlName: string, formControl: FormControl): void {
    this.requestForm.addControl(formControlName, formControl);
  }

  public changeGender(value: Gender): void {
    this.request.gender = value;
  }

  public apply(): void {
    Object.keys(this.requestForm.controls).forEach(key => {
      this.requestForm.get(key).markAsTouched();
      this.requestForm.get(key).markAsDirty();
    });

    if (this.requestForm.valid) {
      this.userData.emit(this.request);
    }
  }

  goToToDataProtectionPage(): void {
    const path = `/${ SHARED_ROUTES_NAMES.DATAPROTECTION }`;
    const trackingQueryParams = getTrackingQueryParams();
    const tree = this.router.createUrlTree([ path ], { queryParams: trackingQueryParams });
    const url = this.serializer.serialize(tree);

    this.window.open(url, '_blank');
  }
}
