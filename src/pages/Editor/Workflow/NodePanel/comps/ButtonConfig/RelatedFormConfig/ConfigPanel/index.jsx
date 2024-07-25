import React from 'react';
import { COMP_NAMES_MAP } from '@/pages/Editor/AuditForm/consts';
import * as Content from './content';
import { useStore } from '../formStore';
import styles from './styles.less';

const getPanelContent = (type) => {
  const Panel = Content[COMP_NAMES_MAP[type]];
  return <Panel />;
};

const ConfigPanel = () => {
  const { activeItem } = useStore();

  return (
    <div className={styles.container}>
      {activeItem && getPanelContent(activeItem?.type)}
    </div>
  );
};

export default ConfigPanel;
