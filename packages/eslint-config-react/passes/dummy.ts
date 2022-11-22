const dummyFn: (x: string) => string = (x) => {
  x += `${x}-1`;
  return x;
};
export default dummyFn;
