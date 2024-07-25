import React, { useState, useEffect } from 'react';
import { Form, Modal } from 'antd';
import { COMP_NAMES_MAP, COMP_NAMES } from '@/pages/Editor/AuditForm/consts';
import * as DeskComps from '../DesktopComps';
import dayjs from 'dayjs';
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
    <Modal
      open={open}
      title={isEdit ? '修改' : '新增'}
      okText="保存"
      cancelText="取消"
      onOk={save}
      onCancel={onCancel}
      destroyOnClose
    >
      <Form form={form} layout="vertical" preserve={false}>
        {list?.map((el) => {
          const Comp = DeskComps[COMP_NAMES_MAP[el.type]];
          //给datePicker加上当前时间默认值
          const isDatePicker = el.type === COMP_NAMES.DATE_PICKER;
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
              initialValue={
                el.attrs?.value ||
                (isDatePicker
                  ? dayjs().format('YYYY-MM-DD HH:mm:ss')
                  : undefined)
              }
            >
              <Comp {...el.attrs} style={{ width: '100%' }} />
            </Form.Item>
          );
        })}
      </Form>
    </Modal>
  );
};

export default RowModal;
