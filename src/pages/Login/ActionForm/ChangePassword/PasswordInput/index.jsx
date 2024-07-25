import React from 'react';
import { Input, Form } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import styles from './styles.less';

const PasswordInput = (props) => {
  const { status, errors } = Form.Item.useStatus();
  console.log('status', status);

  return (
    <>
      <Input.Password {...props} type="password" placeholder="请输入" />
      <div className={styles.hint + ' ' + styles[`${status}`]}>
        <InfoCircleFilled className={styles.icon} />
        密码由8~20位字符组成，必须同时包含大写字母，小写字母，数字及标点符号（除空格）
      </div>
    </>
  );
};

export default PasswordInput;
