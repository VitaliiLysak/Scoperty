import createNumberMask from 'text-mask-addons/dist/createNumberMask';

export const AMOUNT_INPUT_MASK = (integerLimit: number) => {
  return createNumberMask({
    prefix: '',
    suffix: ' €',
    thousandsSeparatorSymbol: '.',
    integerLimit,
  });
};
