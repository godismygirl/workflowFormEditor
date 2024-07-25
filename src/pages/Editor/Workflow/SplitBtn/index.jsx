import React from 'react';
import { useModel } from 'umi';
import style from './style.less';

const SplitBtn = ({ nodeId }) => {
  const { splitCondition } = useModel('useWorkflow');

  const addBranch = () => {
    splitCondition(nodeId);
  };

  return (
    <div className={style.split} onClick={addBranch}>
      添加条件
    </div>
  );
};

export default React.memo(SplitBtn);
