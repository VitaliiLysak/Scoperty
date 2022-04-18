import {
  Injectable,
  Inject,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  BehaviorSubject,
  Observable,
  Subject,
  EMPTY
} from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import Amplify, { Auth } from 'aws-amplify';

import {
  IUserData,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserSession,
  UserObjectAttributes,
} from '../models/user.model';
import {
  AddFavoriteSignupInfo,
  ClaimApartmentSignupInfo,
  ClaimPropertySignupInfo,
  OpenMarketAttractivitySignupInfo,
  SignupInfo,
  ContactOwnerSignupInfo,
} from '../models/signup-info/signup-info.model';
import {
  OfferPrice,
  SearchAlertsScheme,
} from '../models/properties-repository.model';
import { SignupState } from '../models/signup.model';
import { SMSLimitExceededException, VerificationCodeMismatchException } from '../models/errors.model';
import { SignupInfoSerializer } from '../models/signup-info/signup-info.serializer';
import { CreateOfferSignupInfoSerializer } from '../models/signup-info/create-offer-signup-info.serializer';
import { CreateSearchAlertsSignupInfoSerializer } from '../models/signup-info/create-search-alerts-signup-info.serializer';
import { WhereUserCameFromMetadata, WhereUserCameFromKind, WhereUserCameFrom } from '../models/where-user-came-from.model';
import {
  AWS_SETTINGS,
  AWS_SETTINGS_DISSENT,
  PASSWORD_REQUIRED,
  CognitoUserFields,
  HTTP_Settings
} from '../../app.constants';
import { isNullOrUndefined } from '../../shared/utils/null-or-undefined.util';

import { LOGGER } from './logger/logger.provider';
import { LoggerService } from './logger/logger.service';
import { HookProfileService } from './hook-profile.service';
import { AnalyticsService } from './analytics/analytics.service';
import { QueryParamsService, TrackingQueryParams } from './query-params.service';

export enum ConfigureType {
  Default = 'Default',
  Dissent = 'Dissent',
}

Amplify.configure({
  Auth: {
    // Amazon Cognito User Pool ID
    userPoolId: AWS_SETTINGS.userPoolId,
    // Amazon Cognito Web Client ID
    userPoolWebClientId: AWS_SETTINGS.clientId,
  }
});

export const ForgotPasswordDeliveryMedium = {
  Email: 'EMAIL',
  Sms: 'SMS',
};

export interface ForgotPasswordData {
  AttributeName: string;
  DeliveryMedium: string; // FIXME: Replace with enum when TypeScript version Xxx was installed.
  Destination: string;
}

export interface ForgotPassword {
  email: string;
  data: ForgotPasswordData;
}

// @FIXME: Replace with an Enum when string Enums are available
export const AuthException = {
  UserNameExists: 'UsernameExistsException',
  UserNotConfirmed: 'UserNotConfirmedException',
  UnknownError: 'SignUpUnknownException',
  UserNotFound: 'UserNotFoundException',
  CodeMismatch: 'CodeMismatchException',
  NotAuthorizedException: 'NotAuthorizedException',
  LimitExceededException: 'LimitExceededException',
};

enum GTMFormSubmissionType {
  PutOffer = 'registration-putoffer',
  Favorites = 'registration-favorites',
  Navigation = 'registration-navigation',
  SearchAlert = 'registration-searchalert',
  ContactOwner = 'registration-contactowner',
  ClaimProperty = 'registration-ownercockpit',
  ClaimApartment = 'registration-claimapartment',
  MarketAttractivity = 'registration-marketattractivity',
}

@Injectable()
export class AuthService {
  private authSource = new Subject<void>();
  private _isloggedIn: boolean = false;
  private _redirectUrl: string = '/map';
  private _loginUrl: string = '/login';
  private _signupState: SignupState = null;
  private user: CognitoUser = null;
  private userInvite: CognitoUser = null;
  private configureType: ConfigureType = ConfigureType.Default;
  private defaultPassword: string = 'Passw0rd';
  private signupProcessData: SignupInfo = null;
  private gtmFormSubmissionType: GTMFormSubmissionType = null;

  private loggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  readonly loggedIn$: Observable<boolean> = this.loggedInSubject.asObservable();

  get isDefaultConfigureType(): boolean {
    return this.configureType === ConfigureType.Default;
  }

  get isDissentConfigureType(): boolean {
    return this.configureType === ConfigureType.Dissent;
  }

  events = this.authSource.asObservable();

  setAddFavoriteSignupInfo(markerId: string): void {
    this.signupProcessData = new AddFavoriteSignupInfo(markerId);
    this.gtmFormSubmissionType = GTMFormSubmissionType.Favorites;
  }

  setCreateSearchAlertsSignupInfo(searchAlertsData: SearchAlertsScheme): void {
    this.signupProcessData = CreateSearchAlertsSignupInfoSerializer.from(searchAlertsData);
    this.gtmFormSubmissionType = GTMFormSubmissionType.SearchAlert;
  }

  setCreateOfferSignupInfo(createOfferData: OfferPrice): void {
    this.signupProcessData = CreateOfferSignupInfoSerializer.from(createOfferData);
    this.gtmFormSubmissionType = GTMFormSubmissionType.PutOffer;
  }

  setClaimPropertySignupInfo(propertyId: string, livingArea: string, constructionYear: string): void {
    this.signupProcessData = new ClaimPropertySignupInfo(propertyId, livingArea, constructionYear);
    this.gtmFormSubmissionType = GTMFormSubmissionType.ClaimProperty;
  }

  setClaimApartmentSignupInfo(propertyId: string, floor: string, location: string): void {
    this.signupProcessData = new ClaimApartmentSignupInfo(propertyId, floor, location);
    this.gtmFormSubmissionType = GTMFormSubmissionType.ClaimApartment;
  }

  setContactOwnerSignupInfo(markerId: string): void {
    this.signupProcessData = new ContactOwnerSignupInfo(markerId);
    this.gtmFormSubmissionType = GTMFormSubmissionType.ContactOwner;
  }

  setOpenMarketAttractivitySignupInfo(propertyId: string): void {
    this.signupProcessData = new OpenMarketAttractivitySignupInfo(propertyId);
    this.gtmFormSubmissionType = GTMFormSubmissionType.MarketAttractivity;
  }

  setFormSubmissionFromNavigation(): void {
    this.gtmFormSubmissionType = GTMFormSubmissionType.Navigation;
  }

  clearSignupInfo(): void {
    if (!isNullOrUndefined(this.signupProcessData)) {
      this.signupProcessData = null;
    }
  }

  async getSignupInfo(): Promise<SignupInfo>  {
    if (!this.isUserLoggedIn()) {
      return null;
    }

    const { 'custom:signupProcess': signupProcessData } = await this.getUserAttributes();
    this.signupProcessData = SignupInfoSerializer.deserialize(signupProcessData);
    return this.signupProcessData;
  }

  initConfigure(type: ConfigureType = ConfigureType.Default): void {
    if (type === ConfigureType.Dissent) {
      Amplify.configure({
        Auth: {
          // Amazon Cognito User Pool ID
          userPoolId: AWS_SETTINGS_DISSENT.userPoolId,
          // Amazon Cognito Web Client ID
          userPoolWebClientId: AWS_SETTINGS_DISSENT.clientId,
        }
      });
    } else if (type === ConfigureType.Default) {
      Amplify.configure({
        Auth: {
          // Amazon Cognito User Pool ID
          userPoolId: AWS_SETTINGS.userPoolId,
          // Amazon Cognito Web Client ID
          userPoolWebClientId: AWS_SETTINGS.clientId,
        }
      });
    }

    this.configureType = type;
  }

  get signupState() {
    return this._signupState;
  }

  set signupState(newState: SignupState) {
    this._signupState = newState;
  }

  get redirectUrl(): string {
    return this._redirectUrl;
  }

  set redirectUrl(url: string) {
    this._redirectUrl = url;
  }

  get loginUrl(): string {
    return this._loginUrl;
  }

  constructor(
    private hookProfileService: HookProfileService,
    private analyticsService: AnalyticsService,
    private httpClient: HttpClient,
    private queryParamsService: QueryParamsService,
    @Inject(LOGGER) private logger: LoggerService
  ) {
    this.setCurrentUser();
  }

  async userAuth(email: string, password: string): Promise<CognitoUser> {
    let user: any = null;
    if (this.configureType === ConfigureType.Dissent) {
      user = await Auth.signIn(email, this.defaultPassword);
    } else {
      user = await Auth.signIn(email, password);
      if (user.challengeName === PASSWORD_REQUIRED) this.userInvite = user;
      await this.setCurrentUser();
      await this.hookProfileService.hookUpdateProfile();
    }
    return user;
  }

  async completeNewPassword(newPassword: string): Promise<CognitoUser> {
    try {
      return await Auth.completeNewPassword(this.userInvite, newPassword, null);
    } catch (error) {
      this.logger.error(`AuthService::completeNewPassword data is ${error.message}`);
    } finally {
      this.userInvite = null;
    }
  }

  async signUp(userData: IUserData): Promise<any> {
    // If use CognitoUser as return type then we will have an issue
    // related to types from aws-cognito library
    // we send to mandatory fields `given_name` and `family_name` dummy value (let it be '__use_custom_attrs_instead__')
    // in this way we mark family_name and given_name as deprecated.
    // Instead we added _family_name and _given_name to be used instead.
    // The original problem was because we have to keep old user pool, but family_name and given_name are mandatory there,
    // so we have to send dummy values to make it work with new registration flow

    let signUpParams = null;

    if (this.configureType === ConfigureType.Dissent) {
      signUpParams = {
        username: userData.number,
        password: 'Passw0rd',
        attributes: {
          email: userData.email,
          phone_number: userData.number,
          family_name: userData[CognitoUserFields.FamilyName],
          given_name: userData[CognitoUserFields.GivenName],
        },
        validationData: [],
      };
    } else {
      signUpParams = {
        username: userData.email,
        password: userData.password,
        attributes: {
          email: userData.email,
          family_name: '__use_custom_attrs_instead__',
          given_name: '__use_custom_attrs_instead__',
          'custom:signupProcess': this.signupProcessData ? SignupInfoSerializer.serialize(this.signupProcessData) : '' ,
          'custom:commercial': userData.commercial,
        },
        validationData: [],
      };
    }

    const { user, userSub } = await Auth.signUp(signUpParams);
    const detypedUser = user as any;

    if (!detypedUser.attributes) {
      detypedUser.attributes = {};
    }

    detypedUser.attributes.sub = userSub;

    this.sendDataWhereUserCameFrom(userSub).subscribe();

    return detypedUser;
  }

  // @FIXME: Rename, at the moment used in different places. In other places the behaviour is not defined.
  // After the behaviour was defined, use this method instead of the signUp(...) and rename it appropriate.
  // Modified version from the signUp(...) method, which differentiates between UserNameExists and UserNotConfirmed.
  async signUp2(user: IUserData): Promise<CognitoUser> {
    try {
      if (!isNullOrUndefined(this.gtmFormSubmissionType)) {
        this.analyticsService.triggerFormSubmissionSuccess('signupForm', this.gtmFormSubmissionType);
      } else {
        this.logger.error('Analytics data could not be sent, please specify form submission type.');
      }
      return await this.signUp(user);
    } catch (signUpError) {
      const userExists = signUpError.code === AuthException.UserNameExists;
      if (!userExists) {
        // Should not run into this code because if user exists then the signUp(...) call is successful
        throw new Error(AuthException.UnknownError);
      }

      try {
        const { email } = user;
        await Auth.signIn(email);
        throw new Error(AuthException.UserNameExists);
      } catch (signInError) {
        const userNotConfirmed = signInError.code === AuthException.UserNotConfirmed;
        if (userNotConfirmed) {
          throw new Error(AuthException.UserNotConfirmed);
        }

        throw new Error(AuthException.UserNameExists);
      }
    }
  }

  async confirm(email, code): Promise<any> {
    return await Auth.confirmSignUp(email, code, {forceAliasCreation: true});
  }

  async logout(): Promise<void> {
    if (this.user != null) {
      await Auth.signOut();
      this.user = null;
      this.loggedInSubject.next(false);
      this.authSource.next();
    }
  }

  async updateProfile(givenName: string, familyName: string): Promise<string> {
    const user = this.getCurrentUser();
    const result = await Auth.updateUserAttributes(user, {
      [CognitoUserFields.GivenName]: givenName,
      [CognitoUserFields.FamilyName]: familyName,
    });
    await this.hookProfileService.hookUpdateProfile();
    return result;
  }

  async forgotPassword(email: string): Promise<ForgotPassword> {
    const data = await Auth.forgotPassword(email);
    return {
      email,
      data: data.CodeDeliveryDetails,
    };
  }

  async confirmForgotPassword(email: string, verificationCode: string, newPassword: string): Promise<void> {
    await Auth.forgotPasswordSubmit(email, verificationCode, newPassword);
  }

  async changePassword(oldPass: string, newPass: string): Promise<void> {
    await Auth.changePassword(this.getCurrentUser(), oldPass, newPass);
  }

  async sendCode(): Promise<void> {
    await Auth.verifyCurrentUserAttribute('phone_number');
  }

  async confirmUserPhone(code): Promise<void> {
    try {
      await Auth.verifyCurrentUserAttributeSubmit('phone_number', code);
    } catch (error) {
      this.logger.error('AuthService::confirmUserPhone', error);

      if (error.code === AuthException.CodeMismatch) {
        throw new VerificationCodeMismatchException();
      } else if (error.code === AuthException.LimitExceededException) {
        throw new SMSLimitExceededException();
      } else {
        throw new Error('AuthService::confirmUserPhone');
      }
    }
  }

  async updatePhone(phone): Promise<string> {
    const user = this.getCurrentUser();
    const result = await Auth.updateUserAttributes(user, {
      'phone_number': phone
    });
    await this.hookProfileService.hookUpdateProfile();
    return result;
  }

  async getUserAttributes(): Promise<UserObjectAttributes> {
    if (!this.user) await this.setCurrentUser();
    try {
      return await this.getAttributes(this.user);
    } catch (error) {
      this.logger.error(`AuthService::getUserAttributes data is ${error.message}`);
    }
  }

  async clearSignupProcessInfo(): Promise<string> {
    const user = this.getCurrentUser();
    try {
      this.clearSignupInfo();
      return await Auth.updateUserAttributes(user, {
        'custom:signupProcess': '',
      });
    } catch (error) {
      this.logger.error(`AuthService::clearSignupProcessInfo data is ${error.message}`);
    }
  }

  async getUserAttributesAsync(): Promise<UserObjectAttributes> {
    try {
      const userAsync: CognitoUser = await this.getCurrentUserAsync();
      return await this.getAttributes(userAsync);
    } catch (error) {
      this.logger.error(`AuthService::getUserAttributesAsync data is ${error.message}`);
    }
  }

  async getUserInfo(): Promise<any> {
    if (!this.user) await this.setCurrentUser();
    try {
      return await Auth.currentUserInfo();
    } catch (error) {
      return new Error(`AuthService::getUserInfo data is ${error.message}`);
    }
  }

  async setCurrentUser(): Promise<void> {
    try {
      this.user = await Auth.currentAuthenticatedUser();
      this.authSource.next();
      this.loggedInSubject.next(true);
    } catch (error) {
      if (error === 'not authenticated') {
        this.user = null;
        this.authSource.next();
        this.loggedInSubject.next(false);
      } else {
        this.logger.error(`AuthService::setCurrentUser data is ${error.message}`);
      }
    }
  }

  getCurrentUser(): CognitoUser {
    return this.user;
  }

  async isUserEmailNotConfirmed(email: string): Promise<boolean> {
    return Auth.signIn(email, '1')
      .then(() => Auth.signOut())
      .then(() => true)
      .catch(err => err.code === 'UserNotConfirmedException');
  }

  async isUserWithEmailExist(email: string): Promise<boolean> {
    return Auth.signIn(email, '1')
      .then(() => Auth.signOut())
      .then(() => true)
      .catch(err => {
        switch (err.code) {
          case 'UserNotFoundException':
            return false;
          case 'NotAuthorizedException':
            return true;
          case 'PasswordResetRequiredException':
            return false;
          case 'UserNotConfirmedException':
            return true;
          default:
            return false;
        }
      });
  }

  async getCurrentUserAsync(): Promise<CognitoUser> {
    try {
      return await Auth.currentAuthenticatedUser();
    } catch (error) {
      if (error === 'not authenticated') {
        return null;
      } else {
        this.logger.error(`AuthService::getCurrentUserAsync data is ${error.message}`);
      }
    }
  }

  public deleteUser(): Observable<any> {
    return this.httpClient.delete(`${HTTP_Settings.host}/profile`);
  }

  clearSignupState(): void {
    this.signupState = null;
  }

  send(option: string): void {
    switch (option) {
      case 'login' || 'alreadyLogin':
        this._isloggedIn = true;
        this.loggedInSubject.next(true);
        break;
      case 'logout':
        this._isloggedIn = false;
        this.loggedInSubject.next(false);
        break;
      default:
        this._isloggedIn = false;
        this.loggedInSubject.next(false);
    }
    this.authSource.next();
  }

  isUserLoggedIn(): boolean {
    return this.user != null;
  }

  async getSession(): Promise<CognitoUserSession> {
    return await Auth.currentSession();
  }

  private async getAttributes(user: CognitoUser): Promise<UserObjectAttributes> {
    const data: CognitoUserAttribute[] = await Auth.userAttributes(user);
    return data.reduce((response, item) => {
      response[item.getName()] = item.getValue();
      return response;
    }, {} as UserObjectAttributes);
  }

  async resendConfirmation(username: string): Promise<void> {
    await Auth.resendSignUp(username);
  }

  private sendDataWhereUserCameFrom(userSubCognito: string): Observable<Object> {
    return this.queryParamsService.trackingQueryParams$
      .pipe(
        switchMap((trackingQueryParams: TrackingQueryParams) => {
          if (!isNullOrUndefined(trackingQueryParams)) {
            const metadata: WhereUserCameFromMetadata = trackingQueryParams;
            const whereUserCameFrom: WhereUserCameFrom = {
              sub: userSubCognito,
              kind: WhereUserCameFromKind.UserRegistered,
              metadata: metadata
            };

            return this.httpClient.post(`${HTTP_Settings.host}/profile/events`, whereUserCameFrom);
          } else {
            return EMPTY;
          }
        }),
        catchError((error) => {
          throw this.logger.error('AuthService::sendDataWhereUserCameFrom:Error', error);
        })
      );
  }
}
