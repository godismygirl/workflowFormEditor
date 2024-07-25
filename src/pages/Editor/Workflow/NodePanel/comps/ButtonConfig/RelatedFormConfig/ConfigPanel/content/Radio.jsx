import React, { useEffect, useState } from 'react';
import { useStore } from '../../formStore';
import { Form, Radio, Input, Button, Space, Checkbox, Switch } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './styles.less';

const RadioConfig = () => {
  const [form] = Form.useForm();
  const { activeItem, updateAttrs } = useStore();

  const update = async () => {
    const formData = await form.validateFields();

    updateAttrs(activeItem.id, {
      label: formData.label,
      value: formData.options[formData.opIndex]?.label,
      options: formData.options.map((el) => ({
        label: el.label,
        value: el.label,
        desc: el.desc,
      })),
      direction: formData.direction,
      required: formData.required,
    });
  };

  useEffect(() => {
    const defaultRadioValue = activeItem.attrs.options.findIndex(
      (el) => el.value === activeItem.attrs.value,
    );
    form.setFieldsValue({
      ...activeItem?.attrs,
      opIndex: defaultRadioValue,
    });
  }, [activeItem.id]);

  return (
    <Form form={form} layout="vertical" onValuesChange={update}>
      <Form.Item label="标签名" name="label">
        <Input />
      </Form.Item>
      <div className={styles.blockTitle}>选项列表</div>

      <Form.Item name="opIndex" initialValue={0}>
        <Radio.Group style={{ width: '100%' }}>
          <Form.List name="options" label="选项列表">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }, index) => (
                  <Space
                    key={key}
                    style={{ display: 'flex', marginBottom: 8 }}
                    align="baseline"
                  >
                    <Radio value={index}></Radio>
                    <Form.Item
                      {...restField}
                      name={[name, 'label']}
                      rules={[{ required: true, message: '选项名必填' }]}
                    >
                      <Input placeholder="选项名" />
                    </Form.Item>

                    {/* <Form.Item
                    {...restField}
                    name={[name, 'desc']}
                    valuePropName="checked"
                  >
                    <Checkbox>备注</Checkbox>
                  </Form.Item> */}
                    <MinusCircleOutlined
                      style={{ fontSize: 16 }}
                      onClick={() => remove(name)}
                    />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    添加选项
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Radio.Group>
      </Form.Item>

      <Form.Item label="排列方向" name="direction">
        <Radio.Group
          options={[
            { label: '垂直', value: 'vertical' },
            { label: '水平', value: 'horizontal' },
            { label: '下拉', value: 'dropdown' },
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

export default React.memo(RadioConfig);
