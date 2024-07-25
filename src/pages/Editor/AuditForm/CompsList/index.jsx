import React from 'react';
import DragableComp from './DragableComp';
import {
  INTERATC_COMPS_LIST,
  LAYOUT_COMPS_LIST,
  UI_COMPS_LIST,
  BUSINESS_COMPS_LIST,
} from '../consts';
import styles from './styles.less';

const CompsList = ({ style }) => {
  return (
    <div className={styles.compsList}>
      <div className={styles.header}>基础组件</div>
      <div className={styles.section}>
        {INTERATC_COMPS_LIST.map((comp, index) => (
          <DragableComp key={index} {...comp} />
        ))}
      </div>
      <div className={styles.header}>业务组件</div>
      <div className={styles.section}>
        {BUSINESS_COMPS_LIST.map((comp, index) => (
          <DragableComp key={index} {...comp} />
        ))}
      </div>
      <div className={styles.header}>布局组件</div>
      <div className={styles.section}>
        {LAYOUT_COMPS_LIST.map((comp, index) => (
          <DragableComp key={index} {...comp} />
        ))}
      </div>

      <div className={styles.header}>UI组件</div>
      <div className={styles.section}>
        {UI_COMPS_LIST.map((comp, index) => (
          <DragableComp key={index} {...comp} />
        ))}
      </div>
    </div>
  );
};

export default React.memo(CompsList);
