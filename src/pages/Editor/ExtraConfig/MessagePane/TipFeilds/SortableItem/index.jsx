import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { MenuOutlined } from '@ant-design/icons';
import { CSS } from '@dnd-kit/utilities';
import styles from './styles.less';

const SortableItem = ({ id, name }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    padding: '2px 0',
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className={styles.listItem}>
        <i className={styles.itemIcon}>
          <MenuOutlined />
        </i>
        <span className={styles.itemLabel}>{name}</span>
      </div>
    </div>
  );
};

export default SortableItem;
