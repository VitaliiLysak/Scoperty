import { toNumber } from './to-number.util';

describe('Convert to number function', () => {

  it(`toNumber will return 'number' from numeric 'string'`, () => {
    expect(toNumber('10', 10)).toBe(10);
  });

  it(`toNumber will return 'number' from positive number`, () => {
    expect(toNumber(10, 40)).toBe(10);
  });

  it(`toNumber will return 'number' from positive numeric 'string'`, () => {
    expect(toNumber('+10', 30)).toBe(10);
  });

  it(`toNumber will return negative 'number' from negative numeric 'string'`, () => {
    expect(toNumber('-10', 30)).toBe(-10);
  });

  it(`toNumber won't parse 'string' and will return 'number' from second argument`, () => {
    expect(toNumber('asdf', 20)).toBe(20);
  });

  it(`toNumber won't parse 'NaN' and will return 'number' from second argument`, () => {
    expect(toNumber(NaN, 45)).toBe(45);
  });

  it(`toNumber won't parse 'object' and will return 'number' from second argument`, () => {
    expect(toNumber({}, 23)).toBe(23);
  });

  it(`toNumber won't parse 'undefined' and will return 'number' from second argument`, () => {
    expect(toNumber(void 0, 24)).toBe(24);
  });
});
