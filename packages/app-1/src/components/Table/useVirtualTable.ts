import type { Row } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';

const useVirtualTable = <T>({ ref, rows }: { ref: RefObject<HTMLElement>; rows: Row<T>[] }) => {
  const virtualizer = useVirtualizer({
    parentRef: ref,
    getScrollElement: () => ref.current,
    count: rows.length,
    overscan: 10,
    estimateSize: () => 48
  });

  const newRows = virtualizer.getVirtualItems().map((vRow) => {
    const row = rows[vRow.index] as Row<T>;
    return {
      ...row,
      ...vRow,
      'data-index': vRow.index,
      ref: virtualizer.measureElement
    };
  });

  return {
    virtualizer,
    rows: newRows
  };
};

export default useVirtualTable;
