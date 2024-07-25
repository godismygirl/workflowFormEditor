import React, { useEffect } from 'react';
import { Form, Radio } from 'antd';
import PostPicker from '@/comps/PostPicker';
import DepartPicker from '@/comps/DepartPicker';
import RolePicker from '@/comps/RolePicker';
import styles from './styles.less';

const RoleRangeSelect = ({ value, onChange, ...rest }) => {
  const [form] = Form.useForm();
  const radio = Form.useWatch('radio', form);

  const onFormChange = (changed, formData) => {
    if (
      formData.role?.length > 0 &&
      !(formData.radio === 'other' && !formData.otherDepart?.length > 0)
    ) {
      onChange?.({
        approvalObjects: formData.role,
        filter: {
          departFilter: {
            approvalObject:
              formData.radio === 'other'
                ? formData.otherDepart[0]
                : { id: formData.radio },
          },
        },
      });
    } else {
      onChange();
    }

    setTimeout(() => {
      form.validateFields();
    }, 0);
  };

  useEffect(() => {
    if (value) {
      form.setFieldsValue({
        role: value?.approvalObjects,
      });

      const departValue = value?.filter?.departFilter?.approvalObject?.id;
      if (!departValue) return;

      if (departValue === 'org' || departValue === 'initiator') {
        form.setFieldsValue({ radio: departValue });
      } else {
        form.setFieldsValue({
          radio: 'other',
          otherDepart: [value?.filter?.departFilter?.approvalObject],
        });
      }
    }
  }, [value]);

  useEffect(() => {
    form.validateFields();
  }, []);

  return (
    <Form
      className={styles.container}
      form={form}
      onValuesChange={onFormChange}
    >
      <Form.Item name="role" noStyle rules={[{ required: true }]}>
        <RolePicker />
      </Form.Item>
      <div className={styles.bottom}>
        <Form.Item name="radio" noStyle initialValue="org" shouldUpdate>
          <Radio.Group>
            <div className={styles.row}>
              <Radio value="org">全单位</Radio>
              <Radio value="initiator">发起人所属部门</Radio>
              <Radio value="other">特定部门</Radio>
            </div>
          </Radio.Group>
        </Form.Item>
        {radio === 'other' && (
          <div className={styles.otherDepart}>
            <Form.Item name="otherDepart" noStyle rules={[{ required: true }]}>
              <DepartPicker />
            </Form.Item>
          </div>
        )}
      </div>
    </Form>
  );
};

export default RoleRangeSelect;
