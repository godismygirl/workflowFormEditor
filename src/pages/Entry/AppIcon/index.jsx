import React from 'react';
import * as defaultIcons from '@ant-design/icons';
import styles from './styles.less';

const getIcon = (name) => {
  if (!name) return;
  const Comp = defaultIcons[name];
  return <Comp />;
};

const AppIcon = ({ name, hex }) => {
  if (!name) return <i className={styles.empty}></i>;
  return (
    <div className={styles.icon} style={{ background: hex }}>
      {getIcon(name)}
    </div>
  );
};

export default React.memo(AppIcon);
