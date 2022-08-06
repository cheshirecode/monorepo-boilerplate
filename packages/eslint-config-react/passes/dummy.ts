const dummyFn = (a: string) => {
  a += `${a}-1`;
  return dummyFn;
};
export default dummyFn;
