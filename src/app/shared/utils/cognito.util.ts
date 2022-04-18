// Returns modified phone number to match cognito's phone number requirements.

export function getCognitoMobilePhone(mobilePhone: string): string {
  if (mobilePhone.startsWith('00')) {
    return `+${ mobilePhone.substring(2) }`;
  }

  if (mobilePhone.startsWith('0')) {
    return `+49${ mobilePhone.substring(1) }`;
  }

  if (!mobilePhone.startsWith('+')) {
    return `+49${ mobilePhone }`;
  }

  return mobilePhone;
}
