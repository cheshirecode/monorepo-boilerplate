import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

const usePrevious = <T>(value: T): T => {
  const ref: RefObject<T> = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

export default usePrevious;
