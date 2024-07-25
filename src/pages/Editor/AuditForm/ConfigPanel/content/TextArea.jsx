import React, { useEffect } from 'react';
import { useModel } from 'umi';
import { Form, Input, InputNumber, Switch } from 'antd';

const TextAreaConfig = () => {
  const [form] = Form.useForm();
  const { activeItem, updateAttrs } = useModel('useFormLayout');
  const { removeConditionValue } = useModel('useWorkflow');

  const update = (changed, formData) => {
    updateAttrs(activeItem.id, { ...formData });

    if (!changed.required) {
      removeConditionValue(activeItem.id);
    }
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
      <Form.Item label="字号" name="fontSize">
        <InputNumber min={12} />
      </Form.Item>
      <Form.Item label="是否必填" name="required" valuePropName="checked">
        <Switch checkedChildren="是" unCheckedChildren="否" />
      </Form.Item>
    </Form>
  );
};

export default React.memo(TextAreaConfig);
