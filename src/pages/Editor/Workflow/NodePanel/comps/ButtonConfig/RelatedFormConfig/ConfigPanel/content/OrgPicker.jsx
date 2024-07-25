import React, { useEffect } from 'react';
import { useStore } from '../../formStore';
import { Form, Input, Switch } from 'antd';

const OrgPickerConfig = () => {
  const [form] = Form.useForm();
  const { activeItem, updateAttrs } = useStore();

  const update = () => {
    form.validateFields().then((formData) => {
      updateAttrs(activeItem.id, { ...formData });
    });
  };

  useEffect(() => {
    if (activeItem.id) {
      form.setFieldsValue(activeItem?.attrs);
    }
  }, [activeItem.id]);

  return (
    <Form form={form} layout="vertical" onValuesChange={update}>
      <Form.Item label="标签名" name="label">
        <Input />
      </Form.Item>
      <Form.Item label="空白提示" name="placeholder">
        <Input />
      </Form.Item>
      <Form.Item label="是否多选" name="multiple" valuePropName="checked">
        <Switch checkedChildren="是" unCheckedChildren="否" />
      </Form.Item>
      <Form.Item label="是否必填" name="required" valuePropName="checked">
        <Switch checkedChildren="是" unCheckedChildren="否" />
      </Form.Item>
    </Form>
  );
};

export default React.memo(OrgPickerConfig);
