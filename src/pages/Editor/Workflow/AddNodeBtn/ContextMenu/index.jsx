import React from 'react';
import { useModel } from 'umi';
import {
  UserOutlined,
  ApartmentOutlined,
  PaperClipOutlined,
  ApiOutlined,
} from '@ant-design/icons';
import styles from './styles.less';

const ContextMenu = ({ nodeId }) => {
  const { addApprover, addCopy, addCondition, addConnector } =
    useModel('useWorkflow');

  return (
    <div className={styles.menu}>
      <div className={styles.outline}>
        <div
          className={styles.menuItem}
          onClick={() => {
            addApprover(nodeId);
          }}
        >
          <i className={styles.icon}>
            <UserOutlined />
          </i>
          <span className={styles.menuText}>审批人</span>
        </div>
      </div>
      <div className={styles.outline}>
        <div className={styles.menuItem} onClick={() => addCopy(nodeId)}>
          <i className={styles.icon}>
            <PaperClipOutlined />
          </i>
          <span className={styles.menuText}>抄送人</span>
        </div>
      </div>
      <div className={styles.outline}>
        <div className={styles.menuItem} onClick={() => addCondition(nodeId)}>
          <i className={styles.icon}>
            <ApartmentOutlined />
          </i>
          <span className={styles.menuText}>条件分支</span>
        </div>
      </div>
      <div className={styles.outline}>
        <div className={styles.menuItem} onClick={() => addConnector(nodeId)}>
          <i className={styles.icon} style={{ background: '#27ae60' }}>
            <ApiOutlined />
          </i>
          <span className={styles.menuText}>连接器</span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ContextMenu);
