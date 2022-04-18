interface Dictionary<TValue> {
  [key: string]: TValue;
  [index: number]: TValue;
}
