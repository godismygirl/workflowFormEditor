import React, { useState } from 'react';
import { useModel, useMemo } from 'umi';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableItem from '../SearchConfig/SortableItem';
import styles from '../SearchConfig/styles.less';

const SearchConfig = () => {
  const { tableHeadConfig, updateTableHeadIndex, toggeTableHeadOnOff } =
    useModel('useColumnDesign');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
        //delay: 100,
        //tolerance: 5,
      },
    }),
  );

  return (
    <div className={styles.box}>
      <div className={styles.boxHeader}>
        <div className={styles.order}>排序</div>
        <div className={styles.paramName}>字段名</div>
        <div className={styles.compVisible}>是否显示</div>
      </div>
      <DndContext onDragEnd={updateTableHeadIndex} sensors={sensors}>
        <SortableContext
          items={tableHeadConfig}
          strategy={verticalListSortingStrategy}
        >
          {tableHeadConfig?.map((el) => (
            <SortableItem
              key={el.id}
              {...el}
              onSwitch={(checked) =>
                toggeTableHeadOnOff({ id: el.id, enabled: checked })
              }
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default React.memo(SearchConfig);
