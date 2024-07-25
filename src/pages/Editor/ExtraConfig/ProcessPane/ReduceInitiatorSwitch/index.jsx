import React from 'react';
import { Switch } from 'antd';
import styles from './styles.less';

const ReduceInitiatorSwitch = (props) => {
  return (
    <>
      <div>
        <Switch checkedChildren="是" unCheckedChildren="否" {...props} />
        <span className={styles.desc}>
          审批人和发起人是同一人时，审批自动通过
        </span>
      </div>
    </>
  );
};

export default ReduceInitiatorSwitch;
