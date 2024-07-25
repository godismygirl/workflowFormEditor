import React, { useEffect } from 'react';
import { useStore } from '../../formStore';
import { Form, Input, InputNumber } from 'antd';

const TextConfig = () => {
  const [form] = Form.useForm();
  const { activeItem, updateAttrs } = useStore();

  const update = () => {
    form.validateFields().then((formData) => {
      updateAttrs(activeItem.id, {
        label: activeItem?.attrs?.label,
        ...formData,
      });
    });
  };

  useEffect(() => {
    if (activeItem.id) {
      form.setFieldsValue(activeItem?.attrs);
    }
  }, [activeItem.id]);

  return (
    <Form
      form={form}
      layout="vertical"
      onValuesChange={update}
      initialValues={{
        value: activeItem?.attrs?.value,
        fontSize: activeItem?.attrs?.fontSize,
      }}
    >
      <Form.Item label="文本内容" name="value">
        <Input.TextArea rows={5} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item label="字号" name="fontSize">
        <InputNumber min={12} />
      </Form.Item>
    </Form>
  );
};

export default React.memo(TextConfig);
