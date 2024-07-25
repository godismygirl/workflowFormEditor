import React, { useEffect } from 'react';
import { useModel } from 'umi';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Preview from './Preview';
import CompsList from './CompsList';
import ConfigPanel from './ConfigPanel';
import ActionCanvas from './ActionCanvas';
import { TAB_KEY } from '..';
import styles from './styles.less';

const AuditForm = () => {
  const { layout, validate } = useModel('useFormLayout');
  const { updateConfig } = useModel('useColumnDesign');
  const { open, updateResult, updateStatus } = useModel('useSaveProgress');

  const validateFormLayout = () => {
    const isValid = validate();

    if (isValid) {
      updateStatus({
        [TAB_KEY.FORM]: 'finish',
      });
      updateResult({
        [TAB_KEY.FORM]: layout,
      });
    } else {
      updateStatus({
        [TAB_KEY.FORM]: 'error',
      });
    }
  };

  useEffect(() => {
    //打开保存窗时校验
    if (open) {
      validateFormLayout();
    }
  }, [open]);

  useEffect(() => {
    if (layout) {
      updateConfig(layout);
    }
  }, [layout]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.container}>
        <div className={styles.compCol}>
          <CompsList />
        </div>
        <div className={styles.main}>
          <div className={styles.toolbar}>
            <Preview />
          </div>
          <ActionCanvas />
        </div>
        <div className={styles.configCol}>
          <ConfigPanel />
        </div>
      </div>
    </DndProvider>
  );
};

export default React.memo(AuditForm);
