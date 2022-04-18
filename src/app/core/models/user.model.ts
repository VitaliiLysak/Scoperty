export interface IUserData {
  given_name?: string;
  family_name?: string;
  email: string;
  password: string;
  commercial?: string;
  number?: string;
}

export interface CognitoUser {
  challengeName: string;
  username: string;
  uuid: string;
  attributes: UserObjectAttributes;
}

export interface CognitoUserAttribute {
  getValue(): string;
  setValue(value: string): CognitoUserAttribute;
  getName(): string;
  setName(name: string): CognitoUserAttribute;
  toString(): string;
  toJSON(): Object;
}

export interface CognitoUserSession {
  getIdToken(): CognitoIdToken;
  getRefreshToken(): CognitoRefreshToken;
  getAccessToken(): CognitoAccessToken;
  isValid(): boolean;
}

export interface CognitoIdToken {
  getJwtToken(): string;
  getExpiration(): number;
  getIssuedAt(): number;
  decodePayload(): { [id: string]: any; };
}

export interface CognitoRefreshToken {
  getToken(): string;
}

export interface CognitoAccessToken {
  getJwtToken(): string;
  getExpiration(): number;
  getIssuedAt(): number;
  decodePayload(): { [id: string]: any; };
}

export interface UserObjectAttributes {
  given_name?: string;
  family_name?: string;
  phone_number?: string;
  phone_number_verified?: string;
  sub: string;
  email: string;
  'custom:signupProcess'?: string;
  'custom:_given_name'?: string;
  'custom:_family_name'?: string;
}

export enum UserRole {
  Owner = 'owner',
  Realtor = 'realtor',
}

export interface IRegData {
  user: IUserData;
}

export type Role = 'owner' | 'realtor' | 'global' | 'buyer';

export type Mode = 'add_property' | 'registration' | 'delete' | 'set_owner' | 'confirm_phone';
