import { ClassProvider } from '@angular/core';

import { NgxModalStack } from './modal-stack';

export class NgxModalStackMock {}

export const NgxModalStackMockProvider: ClassProvider = {
  provide: NgxModalStack,
  useClass: NgxModalStackMock,
};
