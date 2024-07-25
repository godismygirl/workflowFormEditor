import React, { useEffect } from 'react';
import { useStore } from '../../formStore';
import { Form, Input, InputNumber, Switch } from 'antd';

const ImagePickerConfig = () => {
  const [form] = Form.useForm();
  const { activeItem, updateAttrs } = useStore();

  const update = () => {
    form.validateFields().then((formData) => {
      updateAttrs(activeItem.id, {
        ...formData,
        limitSize: formData.limitSize * 1000000,
      });
    });
  };

  useEffect(() => {
    if (activeItem.id) {
      form.setFieldsValue({
        ...activeItem?.attrs,
        limitSize: activeItem?.attrs?.limitSize / 1000000,
      });
    }
  }, [activeItem.id]);

  return (
    <Form form={form} layout="vertical" onValuesChange={update}>
      <Form.Item label="标题名称" name="label">
        <Input style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        label="提示文字"
        name="placeholder"
        initialValue={activeItem?.attrs?.placeholder}
      >
        <Input style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item label="数量限制" name="maxCount">
        <InputNumber min={1} max={5} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item label="大小限制" name="limitSize">
        <InputNumber
          min={1}
          max={1000}
          style={{ width: '100%' }}
          addonAfter="MB"
        />
      </Form.Item>
      <Form.Item label="是否必填" name="required" valuePropName="checked">
        <Switch checkedChildren="是" unCheckedChildren="否" />
      </Form.Item>
    </Form>
  );
};

export default React.memo(ImagePickerConfig);
