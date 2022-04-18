import { BEMPipe } from './bem.pipe';

describe('Testing BEMPipe', () => {
  let pipe;

  beforeEach(() => {
    pipe = new BEMPipe();
  });

  it('Should return block class', () => {
    expect(pipe.transform({block: 'content', element: ''})).toBe('content__');
  });

  it('Should return block__element class', () => {
    expect(pipe.transform({block: 'container', element: 'btn'})).toBe('container__btn');
  });

  it(`If block is 'null' should throw the Erorr`, () => {
    expect(() => {
      pipe.transform({block: null, element: ''});
    })
    .toThrowError();
  });

  it('If block is long string with empty characters should return a trimmed string', () => {
    expect(pipe.transform({block: 'container              ', element: ''})).toBe('container__');
  });

  it(`If block is 'undefined' should throw the Erorr`, () => {
    expect(() => {
      pipe.transform({block: `${void 0}`, element: ''});
    })
    .toThrowError();
  });

  it('Should return full BEM class', () => {
    expect(pipe.transform({block: 'container', element: 'btn', mods: {color: 'white'}})).toBe('container__btn container__btn--color-white');
  });

  it('Should return block__element class without modificator', () => {
    expect(pipe.transform({block: 'container', element: 'btn', mods: {}})).toBe('container__btn');
  });
});
