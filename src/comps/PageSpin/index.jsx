import React from 'react';
import { Spin } from 'antd';
import styles from './styles.less';

const PageSpin = ({ show, size }) => {
  return (
    <div className={styles.mask} style={{ display: show ? 'flex' : 'none' }}>
      <Spin size={size} />
    </div>
  );
};

export default React.memo(PageSpin);
