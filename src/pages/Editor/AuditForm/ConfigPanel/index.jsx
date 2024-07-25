import React from 'react';
import { useModel } from 'umi';
import { COMP_NAMES_MAP } from '../consts';
import * as Content from './content';
import styles from './styles.less';

const getPanelContent = (type) => {
  const Panel = Content[COMP_NAMES_MAP[type]];
  return <Panel />;
};

const ConfigPanel = () => {
  const { activeItem } = useModel('useFormLayout');

  return (
    <div className={styles.container}>
      {activeItem && getPanelContent(activeItem?.type)}
    </div>
  );
};

export default ConfigPanel;
