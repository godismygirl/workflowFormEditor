import React, { useEffect } from 'react';
import { useModel } from 'umi';
import { Form, Input, Radio, Switch } from 'antd';
import dayjs from 'dayjs';

const DatePickerConfig = () => {
  const [form] = Form.useForm();
  const { activeItem, updateAttrs } = useModel('useFormLayout');

  const update = async () => {
    const formData = await form.validateFields();
    updateAttrs(activeItem.id, {
      ...formData,
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
      <Form.Item label="格式" name="showTimeFormat" initialValue={false}>
        <Radio.Group
          options={[
            { label: '年月日', value: 'YYYY-MM-DD' },
            { label: '年月日-时分', value: 'YYYY-MM-DD HH:mm' },
            { label: '年月日-时分秒', value: 'YYYY-MM-DD HH:mm:ss' },
          ]}
          optionType="button"
          buttonStyle="solid"
        />
      </Form.Item>
      <Form.Item label="是否必填" name="required" valuePropName="checked">
        <Switch checkedChildren="是" unCheckedChildren="否" />
      </Form.Item>
    </Form>
  );
};

export default React.memo(DatePickerConfig);
