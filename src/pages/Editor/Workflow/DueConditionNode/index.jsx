import React, { useMemo } from 'react';
import { useModel } from 'umi';
import { CloseOutlined, RightOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import { COMP_NAMES } from '@/pages/Editor/AuditForm/consts';
import AddNodeBtn from '../AddNodeBtn';
import styles from './styles.less';

const ConditionNode = ({ nodeName, nodeId, defaultCondition }) => {
  const { activeNode, errorNodes } = useModel('useWorkflow');

  const isActive = activeNode?.nodeId === nodeId;
  const isError = errorNodes.find((el) => el.nodeId === nodeId);

  const tagClass = useMemo(() => {
    let classStr = styles.condition;
    if (isError) classStr += ' ' + styles.errorTag;
    if (isActive) classStr += ' ' + styles.activeTag;

    return classStr;
  }, [isActive, isError]);

  return (
    <div className={styles.conditionWrapper}>
      <div className={tagClass}>
        <div className={styles.header}>
          <div className={defaultCondition ? styles.normal : styles.danger}>
            {nodeName}
          </div>
        </div>
      </div>
      <AddNodeBtn nodeId={nodeId} />
    </div>
  );
};

export default React.memo(ConditionNode);
