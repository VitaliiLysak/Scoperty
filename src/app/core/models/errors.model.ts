export class PropertyAlreadyClaimed extends Error {
  constructor() {
    // 'Error' breaks prototype chain here
    super('Property was already claimed by another user');

    // Restore prototype chain, see: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class VerificationCodeMismatchException extends Error {
  constructor() {
    // 'Error' breaks prototype chain here
    super('Invalid verification code provided');

    // Restore prototype chain, see: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class SMSLimitExceededException extends Error {
  constructor() {
    // 'Error' breaks prototype chain here
    super('Attempt limit exceeded, please try after some time');

    // Restore prototype chain, see: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
