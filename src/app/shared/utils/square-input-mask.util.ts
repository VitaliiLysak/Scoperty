import createNumberMask from 'text-mask-addons/dist/createNumberMask';

export const SQUARE_INPUT_MASK = createNumberMask({
  prefix: 'min. ',
  suffix: ' m²',
  thousandsSeparatorSymbol: '',
  integerLimit: 4,
});

export const SQUARE_INPUT_MASK_WITHOUT_PREFIX = createNumberMask({
  prefix: '',
  suffix: ' m²',
  thousandsSeparatorSymbol: '',
  integerLimit: 8,
});
