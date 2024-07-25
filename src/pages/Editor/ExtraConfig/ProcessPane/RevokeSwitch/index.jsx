import React from 'react';
import { Switch } from 'antd';
import styles from './styles.less';

const RevokeSwitch = (props) => {
  return (
    <>
      <div>
        <Switch checkedChildren="是" unCheckedChildren="否" {...props} />
        <span className={styles.desc}>
          开启后，发起人可以随时撤销进行中的流程
        </span>
      </div>
    </>
  );
};

export default RevokeSwitch;
