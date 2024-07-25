import React from 'react';
import { Switch } from 'antd';
import styles from './styles.less';

const SignatureSwitch = (props) => {
  return (
    <>
      <div>
        <Switch checkedChildren="是" unCheckedChildren="否" {...props} />
        <span className={styles.desc}>
          如果此处设置为需要签字，则所有审批人同意时需要签字
        </span>
      </div>
    </>
  );
};

export default SignatureSwitch;
