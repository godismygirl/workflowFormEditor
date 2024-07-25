import React, { useState } from 'react';
import { useModel } from 'umi';
import { Popover } from 'antd';
import { PlusCircleFilled } from '@ant-design/icons';
import ContextMenu from './ContextMenu';
import styles from './styles.less';

const AddNodeBtn = ({ nodeId, hideAction }) => {
  const [isPopOpen, setIsPopOpen] = useState(false);
  return (
    <div className={styles.addBtnNode}>
      <div className={styles.block}>
        {!hideAction && (
          <Popover
            placement="right"
            content={<ContextMenu nodeId={nodeId} />}
            onOpenChange={(op) => setIsPopOpen(op)}
          >
            <div
              className={styles.addBtn}
              style={{ opacity: isPopOpen ? 1 : 0 }}
            >
              <PlusCircleFilled style={{ background: '#fff' }} />
            </div>
          </Popover>
        )}
      </div>
    </div>
  );
};

export default React.memo(AddNodeBtn);
