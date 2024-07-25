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
import SortableItem from './SortableItem';
import styles from './styles.less';

const SearchConfig = () => {
  const { searchCondition, updateSearchIndex, toggeSearchOnOff } =
    useModel('useColumnDesign');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
        //delay: 500,
        //tolerance: 20,
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
      <DndContext onDragEnd={updateSearchIndex} sensors={sensors}>
        <SortableContext
          items={searchCondition}
          strategy={verticalListSortingStrategy}
        >
          {searchCondition?.map((el) => (
            <SortableItem
              key={el.id}
              {...el}
              onSwitch={(checked) =>
                toggeSearchOnOff({ id: el.id, enabled: checked })
              }
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default React.memo(SearchConfig);
