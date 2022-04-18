function runtimeUniqueIdGenerator() {
  let i = 0;
  return () => `runtime-unique${new Date().getTime()}${i++}`;
}

export const runtimeUniqueId = runtimeUniqueIdGenerator();
