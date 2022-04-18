import { EmbededAppartment } from '../../../../core/models/embeded-appartment.model';
import { ExtendedMarkerModel } from '../../../../core/models/extended-marker.model';
import { UserRole } from '../../../../core/models/user.model';

export interface AuthenticationUserInfoModel {
  givenName: string;
  familyName: string;
  phoneNumber: string;
  phoneNumberVerified: boolean;
}

export interface AuthenticationModel {
  userInfo: AuthenticationUserInfoModel;
  property: ExtendedMarkerModel | EmbededAppartment;
  correctedLivingArea?: string;
  correctedConstructionYear?: string;
  apartmentFloor?: string;
  apartmentLivingArea?: string;
  analyticsFormContext: string;
}

export interface AuthenticationFormValue {
  givenName?: string;
  familyName?: string;
  role?: UserRole;
  mobilePhone?: string;
  floor?: string;
  livingArea?: string;
}
