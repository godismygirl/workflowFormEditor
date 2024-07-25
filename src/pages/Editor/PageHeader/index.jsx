import React from 'react';
import { history, useModel } from 'umi';
import * as defaultIcons from '@ant-design/icons';
import { LeftOutlined } from '@ant-design/icons';
import styles from './styles.less';

const PageHeader = () => {
  const { name, icon } = useModel('useAppHeader');

  const getIcon = (name) => {
    if (!name) return;
    const Comp = defaultIcons[name];
    return <Comp />;
  };

  return (
    <div className={styles.header}>
      <div className={styles.back} onClick={() => history.back()}>
        <LeftOutlined />
      </div>
      <div className={styles.icon}>
        <div className={styles.prview} style={{ background: icon?.hex }}>
          {getIcon(icon?.name)}
        </div>
      </div>
      <div className={styles.title}>{name}</div>
    </div>
  );
};

export default PageHeader;
