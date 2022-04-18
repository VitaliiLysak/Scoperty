export function sameObjects(value1: any, value2: any): boolean {
  return JSON.stringify(value1) === JSON.stringify(value2);
}
