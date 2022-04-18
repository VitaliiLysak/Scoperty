import { FallbackValuePipe } from './fallback-value.pipe';

describe('Testing FallbackValuePipe', () => {
  let pipe;

  beforeEach(() => {
    pipe = new FallbackValuePipe();
  });

  it('Should return initial value', () => {
    expect(pipe.transform(3, 2)).toBe(3);
  });

  it('Should return default value', () => {
    expect(pipe.transform(null, 3)).toBe(3);
  });

  it('(null, null) Should return default string value', () => {
    expect(pipe.transform(null, null)).toBe('-');
  });

  it('(void 0, void 0) Should return default string value', () => {
    expect(pipe.transform(void 0, void 0)).toBe('-');
  });
});

