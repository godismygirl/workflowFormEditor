import React, { useEffect } from 'react';
import { uid } from 'uid';
import { useDrag } from 'react-dnd';
import { useStore } from '../../formStore';
import styles from './styles.less';

const DragableComp = ({ type, icon, category, name, attrs }) => {
  const { layout, endDragAction } = useStore();
  //每次h5 layout更新后要更新uid，保证每一次新的拖动生成一个新的comp
  const [{ isDragging }, drag, dragPreview] = useDrag(
    () => ({
      type: 'DRAGABLE_COMP',
      item: {
        id: `${type}-${uid(16)}`,
        type,
        category,
        attrs,
        inDragProcess: true,
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: () => {
        endDragAction();
      },
    }),
    [layout],
  );

  return (
    <div className={styles.outline}>
      <div
        className={
          isDragging ? `${styles.isDraging} ${styles.item}` : styles.item
        }
        ref={dragPreview}
      >
        <div ref={drag}>
          <i className={styles.icon}>{icon}</i>
          <span className={styles.text}>{name}</span>
        </div>
      </div>
    </div>
  );
};

export default DragableComp;
