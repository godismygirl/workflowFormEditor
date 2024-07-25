import React, { useEffect } from 'react';
import { useModel } from 'umi';
import { Form, Input, InputNumber, Radio } from 'antd';

const TitleConfig = () => {
  const [form] = Form.useForm();
  const { activeItem, updateAttrs } = useModel('useFormLayout');

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
      <Form.Item label="字号" name="fontSize">
        <InputNumber min={12} />
      </Form.Item>
      <Form.Item label="标题位置" name="textAlign">
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

export default React.memo(TitleConfig);
