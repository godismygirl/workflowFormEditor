import React from 'react';
import { Spin } from 'antd';
import styles from './styles.less';

const Spinner = ({ show, size, dark }) => {
  return (
    <div
      className={styles.mask}
      style={{
        display: show ? 'flex' : 'none',
        background: dark ? 'rgb(9, 18, 32, 0.1)' : 'rgba(255, 255, 255, 0.1)',
      }}
    >
      <Spin size={size} />
    </div>
  );
};

export default React.memo(Spinner);
