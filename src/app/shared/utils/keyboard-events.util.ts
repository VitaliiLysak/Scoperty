export function isEnterKeyboardEvent(event: KeyboardEvent): boolean {
  const { key, code, keyCode, charCode } = event;
  return key === 'Enter'
    || code === 'Enter'
    || keyCode === 13
    || charCode === 13;
}
