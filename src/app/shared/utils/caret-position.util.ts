/*
 * http://blog.vishalon.net/javascript-getting-and-setting-caret-position-in-textarea
*/
export function getCaretPosition(ctrl: any): {'start': number, 'end': number} {
  if (ctrl.selectionStart != null) {   // IE >=9 and other browsers
    return {'start': ctrl.selectionStart, 'end': ctrl.selectionEnd };
  } else {
    return {'start': 0, 'end': 0};
  }
}

export function setCaretPosition(ctrl: any, pos: number): void {
  if (ctrl.setSelectionRange) {
    ctrl.focus();
    ctrl.setSelectionRange(pos, pos);
  }
}
