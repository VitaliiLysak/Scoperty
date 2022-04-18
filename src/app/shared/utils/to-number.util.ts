export const toNumber = (value: any, fallbackValue: number): number => {
  if (value == null) return fallbackValue;
  const res = Number(value);
  if (!isNaN(res)) return res;
  else return fallbackValue;
};
