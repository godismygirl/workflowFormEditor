import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { Switch } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { CSS } from '@dnd-kit/utilities';
import styles from './styles.less';

const SortableItem = ({ id, attrs, enabled, onSwitch }) => {
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
        <div className={styles.itemLabel}> {attrs?.label}</div>
        <Switch
          style={{ pointerEvents: 'all' }}
          checkedChildren="显示"
          unCheckedChildren="隐藏"
          checked={enabled}
          onClick={(c, e) => {
            e.stopPropagation();
            onSwitch(c);
          }}
        />
      </div>
    </div>
  );
};

export default SortableItem;
