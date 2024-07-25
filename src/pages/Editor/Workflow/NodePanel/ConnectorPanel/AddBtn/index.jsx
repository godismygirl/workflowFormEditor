import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import styles from './styles.less';

const AddBtn = ({ onClick }) => {
  return (
    <div className={styles.btn}>
      <div className={styles.inner}>
        <div className={styles.col} onClick={() => onClick('app')}>
          <i className={styles.icon}>
            <PlusOutlined />
          </i>
          <div className={styles.text}>新建表单连接</div>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.col} onClick={() => onClick('api')}>
          <i className={styles.icon}>
            <PlusOutlined />
          </i>
          <div className={styles.text}>新建服务连接</div>
        </div>
      </div>
    </div>
  );
};

export default AddBtn;
