import { Injectable } from '@angular/core';

@Injectable()
export class FeatureToggleService {
  readonly messaging: boolean = false;
  readonly socialSharing: boolean = false;
  readonly contactEditing: boolean = false;
}
