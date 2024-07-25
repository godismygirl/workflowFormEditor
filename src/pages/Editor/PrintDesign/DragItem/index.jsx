import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { MenuOutlined } from '@ant-design/icons';
import styles from './styles.less';

const DragItem = ({ id, name, data }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      className={styles.item}
      ref={setNodeRef}
      //style={style}
      {...listeners}
      {...attributes}
    >
      <i className={styles.itemIcon}>
        <MenuOutlined />
      </i>
      <span className={styles.text} title={name}>
        {name}
      </span>
    </div>
  );
};

export default DragItem;
