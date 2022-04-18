import { defaultValue } from './default-value.util';

describe('Default value checker', () => {
  it(`defaultValue with one 'undefined' argument will return the 'null'`, () => {
    expect(defaultValue(void 0)).toBe(null);
  });

  it(`defaultValue with one 'null' argument will return the 'null'`, () => {
    expect(defaultValue(null)).toBe(null);
  });

  it(`defaultValue with two string arguments will return the first`, () => {
    expect(defaultValue('holá', 'amigo')).toBe('holá');
  });

  it(`defaultValue with first 'number' and second 'string' arguments will return the 'number'`, () => {
    expect(defaultValue(1, 'holá')).toBe(1);
  });

  it(`defaultValue with two 'number' arguments will return the first`, () => {
    expect(defaultValue(3, 5)).toBe(3);
  });
});
