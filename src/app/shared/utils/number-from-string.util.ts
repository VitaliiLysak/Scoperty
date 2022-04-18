export function getNumberFromString(value: string): number {
  return parseFloat(value.replace(/\.?\,?/ig, ''));
}

export function getNumberFromSquareString(value: string): number {
  const regExp: RegExp = /\d+/g;

  return parseFloat(regExp.exec(value)[0]);
}
