import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'antd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useStore } from './formStore';
import CompsList from './CompsList';
import ConfigPanel from './ConfigPanel';
import ActionCanvas from './ActionCanvas';
import styles from '@/pages/Editor/AuditForm/styles.less';

const RelatedFormConfig = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const { layout, setLayout, setActiveItem } = useStore();

  const onSave = () => {
    onChange?.(layout);
    setOpen(false);
  };

  useEffect(() => {
    if (value) {
      setLayout(value);
    }
  }, [value]);

  return (
    <>
      <Button
        size="small"
        onClick={() => {
          setActiveItem();
          setOpen(true);
        }}
      >
        表单配置
      </Button>
      <Modal
        open={open}
        centered
        width="85vw"
        title="表单配置"
        footer={null}
        onCancel={onSave}
      >
        <DndProvider backend={HTML5Backend}>
          <div className={styles.container} style={{ height: '75vh' }}>
            <div className={styles.compCol}>
              <CompsList />
            </div>
            <div className={styles.main}>
              {/* <div className={styles.toolbar}>
                  <Preview />
                </div> */}
              <ActionCanvas />
            </div>
            <div className={styles.configCol}>
              <ConfigPanel />
            </div>
          </div>
        </DndProvider>
      </Modal>
    </>
  );
};

export default RelatedFormConfig;
