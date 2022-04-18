import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { HTTP_Settings } from '../../app.constants';
import { Role, CognitoUser } from '../models/user.model';
import { isNullOrUndefined } from '../../shared/utils/null-or-undefined.util';

import { AuthService } from './auth.service';
import { LoggerService } from './logger/logger.service';
import { LOGGER } from './logger/logger.provider';

export interface DjangoUser {
  role: Role;
  uuid: string;
}

@Injectable()
export class UserService {
  private _uuid: string = null;

  public owner: Array<string> = ['Idle', 'default', 'MakeMeMove', 'ForSale'];
  public realtor: Array<string> = ['default', 'ForSale'];

  private updateUser(): void {
    if (isNullOrUndefined(this.user)) this.getUserId();
  }

  constructor (
    private http: HttpClient,
    private authService: AuthService,
    @Inject(LOGGER) private logger: LoggerService,
  ) {
    setTimeout(this.updateUser.bind(this), 0);
  }

  public get user(): CognitoUser {
    return this.authService.getCurrentUser();
  }

  public get uuid(): string {
    return this._uuid;
  }

  public async getUserId(): Promise<void> {
    try {
      const { uuid } = await this.http.get<DjangoUser>(`${HTTP_Settings.host}/profile`).toPromise();
      this._uuid = uuid;
    } catch (error) {
      this.logger.error('UserService::getUserRole:Error', error);
    }
  }

  public clearUserInfo(): void {
    this._uuid = null;
  }
}
