import React, { useEffect } from 'react';
import { useStore } from '../../formStore';
import { Form, Input, Radio } from 'antd';

const DividerConfig = () => {
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
    <Form form={form} layout="vertical" onValuesChange={update}>
      <Form.Item label="标题名称" name="value">
        <Input style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item label="标题字号" name="plain">
        <Radio.Group
          optionType="button"
          buttonStyle="solid"
          options={[
            { label: '大号', value: false },
            { label: '小号', value: true },
          ]}
        />
      </Form.Item>
      <Form.Item label="标题位置" name="contentPosition">
        <Radio.Group
          optionType="button"
          buttonStyle="solid"
          options={[
            { label: '居左', value: 'left' },
            { label: '居中', value: 'center' },
            { label: '居右', value: 'right' },
          ]}
        />
      </Form.Item>
    </Form>
  );
};

export default React.memo(DividerConfig);
