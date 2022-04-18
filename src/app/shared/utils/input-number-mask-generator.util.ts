export interface InputNumberMaskGeneratorConfig {
  prefix?: string;
  suffix?: string;
  thousandsSeparatorSymbol?: string;
  integerLimit?: number;
  allowDecimal?: boolean;
  decimalLimit?: number;
  decimalSymbol?: string;
  decimalsFirst?: boolean;
}

function pasteThousandsSeparator(symbol: string, contents: any[]) {
  if (contents.length <= 3) {
    return contents;
  }

  return contents.reduce((prev, curr, i) => {
    if (!((contents.length - i) % 3)) {
      prev.push(symbol);
    }

    prev.push(curr);
    return prev;
  }, []);
}

const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(el => el.toString());

export function inputNumberMaskGenerator(paramConfig: InputNumberMaskGeneratorConfig) {
  const config = {
    integerLimit: 6,
    decimalLimit: 2,
    prefix: '',
    suffix: '',
    decimalSymbol: '.',
    decimalsFirst: false,
    ...paramConfig
  };

  const calculatedLimit = config.integerLimit - config.decimalLimit;

  const parsedPrefix = config.prefix.split('');
  const parsedPostfix = config.suffix.split('');

  return (input: string) => {
    if (isNaN(parseInt(input, 10))) { // if prefix or suffix exist we strip em
      input = input
        .substring(config.prefix.length, input.length - config.suffix.length);
    }

    // filter out dots and whatnot
    let splitInput: any[] = input
      .split('')
      .filter(el => digits.includes(el))
      .map(() => /\d/);

    let allowDecimal = config.allowDecimal && splitInput.length > calculatedLimit;

    let integer = splitInput.slice(0, calculatedLimit);
    let decimal = splitInput.slice(calculatedLimit, config.integerLimit);

    if (config.decimalsFirst) { // if we need to fill out decimal letters first
      allowDecimal = true;
      splitInput = splitInput.slice(0, config.integerLimit);
      decimal = splitInput.slice(splitInput.length - config.decimalLimit);
      integer = splitInput.slice(0, splitInput.length - config.decimalLimit);
    }

    return [
      ...parsedPrefix,
      ...(config.thousandsSeparatorSymbol
        ? pasteThousandsSeparator(config.thousandsSeparatorSymbol, integer)
        : integer),
      ...(allowDecimal
        ? [config.decimalSymbol, ...decimal]
        : []),
      ...parsedPostfix,
    ];
  };
}
