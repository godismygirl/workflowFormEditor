import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Form, Checkbox, Radio, Input, Button, Space, Switch } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './styles.less';

const CheckboxConfig = () => {
  const [form] = Form.useForm();
  const { activeItem, updateAttrs } = useModel('useFormLayout');

  const update = (_, formData) => {
    updateAttrs(activeItem.id, {
      label: formData.label,
      value: formData.options
        .filter((el) => el?.label && el?.checked)
        .map((el) => el.label),
      options: formData.options
        .filter((el) => !!el?.label)
        .map((el) => ({
          label: el.label,
          value: el.label,
        })),
      direction: formData.direction,
      required: formData.required,
    });
  };

  useEffect(() => {
    if (activeItem.id) {
      activeItem.attrs.options = activeItem.attrs.options.map((el) => ({
        ...el,
        checked: activeItem.attrs.value.includes(el.value),
      }));

      form.setFieldsValue(activeItem.attrs);
    }
  }, [activeItem.id]);

  return (
    <Form form={form} layout="vertical" onValuesChange={update}>
      <Form.Item label="标签名" name="label">
        <Input />
      </Form.Item>

      <div className={styles.blockTitle}>选项列表</div>

      <Form.List name="options" label="选项列表">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }, index) => (
              <Space
                key={key}
                style={{ display: 'flex', marginBottom: 8 }}
                align="baseline"
              >
                <Form.Item
                  {...restField}
                  name={[name, 'checked']}
                  valuePropName="checked"
                >
                  <Checkbox></Checkbox>
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'label']}
                  rules={[{ required: true, message: '选项名必填' }]}
                >
                  <Input placeholder="选项名" />
                </Form.Item>
                {/* <Form.Item
                      {...restField}
                      name={[name, 'value']}
                      fieldKey={[fieldKey, 'valueKey']}
                      rules={[{ required: true, message: '选项值必填' }]}
                    >
                      <Input placeholder="选项值" />
                    </Form.Item> */}
                <MinusCircleOutlined
                  style={{ fontSize: 16 }}
                  onClick={() => {
                    remove(name);
                  }}
                />
              </Space>
            ))}
            <div style={{ width: '100%' }}>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                添加选项
              </Button>
            </div>
          </>
        )}
      </Form.List>

      <Form.Item label="排列方向" name="direction">
        <Radio.Group
          options={[
            { label: '垂直', value: 'vertical' },
            { label: '水平', value: 'horizontal' },
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

export default React.memo(CheckboxConfig);
