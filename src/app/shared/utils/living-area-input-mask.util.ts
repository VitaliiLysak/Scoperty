import createNumberMask from 'text-mask-addons/dist/createNumberMask';

export const LIVING_AREA_INPUT_MASK = createNumberMask({
  prefix: '',
  suffix: '',
  thousandsSeparatorSymbol: '.',
  integerLimit: 5,
});
