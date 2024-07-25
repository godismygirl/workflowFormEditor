import React from 'react';
import { UserOutlined, RightOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import AddNodeBtn from '../AddNodeBtn';
import styles from './styles.less';

const StartNode = ({ nodeId }) => {
  const { errorNodes, activeNode, activeProcessNode, removeApprover } =
    useModel('useWorkflow');

  const isActive = activeNode?.nodeId === nodeId;

  return (
    <div className={styles.container}>
      <div className={styles.start} onClick={() => activeProcessNode(nodeId)}>
        <i className={styles.icon}>
          <UserOutlined />
        </i>
        <div className={styles.taskName}>发起</div>
        <i className={styles.right}>
          <RightOutlined />
        </i>
      </div>
      <AddNodeBtn nodeId={nodeId} />
    </div>
  );
};

export default React.memo(StartNode);
