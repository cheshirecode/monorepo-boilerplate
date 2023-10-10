import { useCallback, useState } from 'react';

const useExpanded = () => {
  const [expanded, setExpanded] = useState({});

  const onExpandedChange = useCallback(
    (fn) => {
      const newExpanded = fn(expanded);
      setExpanded(newExpanded);
    },
    [expanded]
  );

  return [expanded, setExpanded, onExpandedChange] as const;
};

export default useExpanded;
