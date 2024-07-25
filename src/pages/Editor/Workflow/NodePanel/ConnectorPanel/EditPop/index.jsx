import React, { useEffect } from 'react';
import { uid } from 'uid';
import { Drawer } from 'antd';
import AppConnector from './AppConnector';
import ApiConnector from './ApiConnector';
import styles from './styles.less';

const EditPop = ({ open, type, onClose, data, onSave }) => {
  const isEdit = !!data;

  const save = (formData) => {
    const result = { id: data?.id ?? uid(16), ...formData, enabled: false };
    onClose();
    onSave?.(result);
  };

  return (
    <Drawer
      placement="right"
      title={isEdit ? '修改连接规则' : '新建连接规则'}
      width={550}
      onClose={onClose}
      open={open}
      className={styles.draw}
      styles={{ body: { paddingBottom: 70 } }}
      destroyOnClose
    >
      {type === 'api' ? (
        <ApiConnector data={data} onSave={save} />
      ) : (
        <AppConnector data={data} onSave={save} />
      )}
    </Drawer>
  );
};

export default React.memo(EditPop);
