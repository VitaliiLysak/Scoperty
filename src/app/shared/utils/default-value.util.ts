export const defaultValue = (value: string | number, fallback = null) => {
  if (value == null || value === `${void 0}`) return fallback;
  return value;
};
