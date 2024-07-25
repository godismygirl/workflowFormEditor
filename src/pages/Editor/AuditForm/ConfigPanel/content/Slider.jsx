import React, { useEffect } from 'react';
import { useModel } from 'umi';
import { Form, Input, InputNumber, Switch } from 'antd';

const SliderConfig = () => {
  const [form] = Form.useForm();
  const { activeItem, updateAttrs } = useModel('useFormLayout');

  const update = (_, formData) => {
    if (
      formData.min > formData.max ||
      (formData.max - formData.min) % formData.step !== 0
    ) {
      return;
    }

    updateAttrs(activeItem.id, formData);
  };

  // const onTogglePercent = (value) => {
  //   if (value) {
  //     //true显示分数模式，最大值固定为100，最小值0;
  //     form.setFieldsValue({
  //       min: 0,
  //       max: 100,
  //       step: 1,
  //       value: 0,
  //     });
  //   }
  // };

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
      <Form.Item
        label="最小值"
        name="min"
        rules={[
          ({ getFieldValue }) => ({
            validator: (_, value) => {
              if (value > getFieldValue('max')) {
                return Promise.reject(new Error('最小值不能大于最小值'));
              }
              return Promise.resolve();
            },
          }),
        ]}
      >
        <InputNumber min={0} />
      </Form.Item>
      <Form.Item
        label="最大值"
        name="max"
        rules={[
          ({ getFieldValue }) => ({
            validator: (_, value) => {
              if (value < getFieldValue('min')) {
                return Promise.reject(new Error('最大值不能小于最小值'));
              }
              return Promise.resolve();
            },
          }),
        ]}
      >
        <InputNumber min={0} />
      </Form.Item>
      <Form.Item
        label="步长"
        name="step"
        rules={[
          ({ getFieldValue }) => ({
            validator: (_, value) => {
              if ((getFieldValue('max') - getFieldValue('min')) % value === 0) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('必须能被(max-min)整除'));
            },
          }),
        ]}
      >
        <InputNumber min={0} />
      </Form.Item>
      {/* <Form.Item label="显示分数" name="percent" valuePropName="checked">
        <Switch
          checkedChildren="是"
          unCheckedChildren="否"
          onChange={onTogglePercent}
        />
      </Form.Item> */}
      <Form.Item
        label="默认值"
        name="value"
        rules={[
          ({ getFieldValue }) => ({
            validator: (_, value) => {
              if (value < getFieldValue('min')) {
                return Promise.reject(new Error('默认值不能小于最小值'));
              }

              if (value > getFieldValue('max')) {
                return Promise.reject(new Error('默认值不能大于最大值'));
              }

              return Promise.resolve();
            },
          }),
        ]}
      >
        <InputNumber min={0} />
      </Form.Item>
      <Form.Item label="是否必填" name="required" valuePropName="checked">
        <Switch checkedChildren="是" unCheckedChildren="否" />
      </Form.Item>
    </Form>
  );
};

export default React.memo(SliderConfig);
