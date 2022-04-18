import { LocaleNumberPipe } from './locale-number.pipe';

describe('Testing LocaleNumberPipe', () => {
  let pipe;

  beforeEach(() => {
    pipe = new LocaleNumberPipe();
  });

  it('Should return initial value', () => {
    expect(pipe.transform(1, 2)).toBe('1');
  });

  it('Should return default value', () => {
    expect(pipe.transform(null, 3)).toBe(3);
  });

  it('(null, null) Should return default string value', () => {
    expect(pipe.transform(null, null)).toBe('0');
  });

  it('(void 0, void 0) Should return default string value', () => {
    expect(pipe.transform(void 0, void 0)).toBe('0');
  });
});
