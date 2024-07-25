import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { Form, Popup, Button, Space } from 'react-vant';
import { COMP_NAMES_MAP } from '@/pages/Editor/AuditForm/consts';
import * as MoblieComps from '../MobileComps';
import styles from './styles.less';

const RowModal = ({ open, index, onCancel, onSave, data, list }) => {
  const [form] = Form.useForm();
  const isEdit = !!data;

  const save = async () => {
    const formData = await form.validateFields();
    onSave({
      index,
      rowData: formData,
    });
    onCancel();
  };

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  }, [open]);

  return (
    <Popup
      visible={open}
      title={isEdit ? '修改' : '新增'}
      position="bottom"
      style={{
        width: '100%',
        height: '100%',
      }}
      className={styles.pop}
      closeable
      onClose={onCancel}
      destroyOnClose
    >
      {/* <Modal
      open={open}
      title={isEdit ? '修改' : '新增'}
      okText="保存"
      cancelText="取消"
      onOk={save}
      onCancel={onCancel}
      destroyOnClose
    > */}
      <div className={styles.body}>
        <Form form={form} preserve={false}>
          {list?.map((el) => {
            const Comp = MoblieComps[COMP_NAMES_MAP[el.type]];
            return (
              <Form.Item
                key={el.id}
                label={el.attrs?.label}
                name={el.id}
                rules={[
                  {
                    required: el.attrs?.required,
                    message: '必填',
                  },
                ]}
                initialValue={el.attrs?.value}
              >
                <Comp {...el.attrs} style={{ width: '100%' }} />
              </Form.Item>
            );
          })}
        </Form>
        {/* </Modal> */}
      </div>
      <div className={styles.footer}>
        <div className={styles.col}>
          <Button block onClick={onCancel}>
            取消
          </Button>
        </div>
        <div className={styles.col}>
          <Button block type="primary" onClick={save}>
            确定
          </Button>
        </div>
      </div>
    </Popup>
  );
};

export default RowModal;
