import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import styles from './styles.less';

const DropArea = (props) => {
  const { isOver, setNodeRef } = useDroppable({
    id: 'droppable',
  });

  const style = {
    color: isOver ? 'green' : undefined,
  };

  return (
    <div className={styles.box} ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
};

export default DropArea;
