import React, { useEffect } from 'react';
import { Radio, Select, Form } from 'antd';
import DepartPicker from '@/comps/DepartPicker';
import styles from './styles.less';

const DepartHeadSelect = ({ value, onChange }) => {
  const [form] = Form.useForm();
  const radio = Form.useWatch('radio', form);

  const onFormChange = (changed, formData) => {
    setTimeout(() => {
      form.validateFields();
    }, 0);

    if (changed.radio === 'initiator') {
      onChange?.([{ id: 'initiator', name: '发起人分管领导' }]);
      return;
    }

    if (changed.radio === 'last_assignee') {
      onChange?.([{ id: 'last_assignee', name: '上一节点审批人分管领导' }]);
      return;
    }

    if (changed.depart) {
      onChange?.(formData.depart);
      return;
    }

    if (changed.radio === 'depart_assignee' && !changed.depart?.length > 0) {
      onChange?.();
      return;
    }
  };

  useEffect(() => {
    if (value) {
      const targetId = value?.[0]?.id;
      if (targetId === 'initiator' || targetId === 'last_assignee') {
        form.setFieldsValue({
          radio: targetId,
        });
      } else {
        form.setFieldsValue({
          radio: 'depart_assignee',
          depart: value,
        });
      }
    }
  }, [value]);

  return (
    <Form form={form} onValuesChange={onFormChange}>
      <Form.Item name="radio" noStyle>
        <Radio.Group style={{ width: '100%' }}>
          <div className={styles.row}>
            <Radio value="initiator">发起人分管领导</Radio>
          </div>
          <div className={styles.row}>
            <Radio value="last_assignee">上一节点审批人分管领导</Radio>
          </div>
          <div className={styles.row}>
            <Radio value="depart_assignee">
              <span>指定部门分管领导</span>
            </Radio>
            {radio === 'depart_assignee' && (
              <>
                <Form.Item name="depart" noStyle rules={[{ required: true }]}>
                  <DepartPicker style={{ width: 180 }} />
                </Form.Item>
              </>
            )}
          </div>
        </Radio.Group>
      </Form.Item>
    </Form>
  );
};

export default DepartHeadSelect;
