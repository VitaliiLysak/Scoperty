import { BooleanToUserFriendly } from './bool-to-user-friendly.pipe';

describe('Testing BooleanToUserFriendly', () => {
  let pipe;

  beforeEach(() => {
    pipe = new BooleanToUserFriendly();
  });

  it('Should return positive answer', () => {
    expect(pipe.transform(true)).toBe('Ja');
  });

  it('Should return negative answer', () => {
    expect(pipe.transform(false)).toBe('Nein');
  });
});
