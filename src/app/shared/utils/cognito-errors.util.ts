enum CognitoErrorCode {
  InvalidParameterException = 'InvalidParameterException',
}

// CognitoErrors class is used to handle different cognito errors in a nice way
// and to have all cognito related errors in one place.
// If new errors are used, please add them to the CognitoErrors class.

export class CognitoErrors {
  public static invalidPhoneNumberFormat = {
    code: CognitoErrorCode.InvalidParameterException,
    message: 'Invalid phone number format.',
  };

  public static isErrorOfType(error: any, errorType: any): boolean {
    const { code, message } = error;
    return code === errorType.code && message === errorType.message;
  }
}
