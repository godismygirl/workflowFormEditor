import React from 'react';
import { Switch } from 'antd';
import styles from './styles.less';

const ReduceApproverSwitch = (props) => {
  return (
    <>
      <div>
        <Switch checkedChildren="是" unCheckedChildren="否" {...props} />
        <span className={styles.desc}>
          同一审批人在流程中重复出现时，自动去重
        </span>
      </div>
    </>
  );
};

export default ReduceApproverSwitch;
