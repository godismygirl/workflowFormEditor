import React, { useEffect } from 'react';
import { useStore } from '../../formStore';
import { Form, Input, Radio, Switch } from 'antd';
import dayjs from 'dayjs';

const DatePickerConfig = () => {
  const [form] = Form.useForm();
  const { activeItem, updateAttrs } = useStore();

  const update = async () => {
    const formData = await form.validateFields();
    updateAttrs(activeItem.id, {
      ...formData,
      value: dayjs().format('YYYY-MM-DD'),
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
      {/* <Form.Item label="显示类型" name="type">
        <Radio.Group
          options={[
            { label: '年月日', value: 'date' },
            { label: '年月', value: 'year-month' },
          ]}
          optionType="button"
          buttonStyle="solid"
        />
      </Form.Item> */}
      <Form.Item label="是否必填" name="required" valuePropName="checked">
        <Switch checkedChildren="是" unCheckedChildren="否" />
      </Form.Item>
    </Form>
  );
};

export default React.memo(DatePickerConfig);
