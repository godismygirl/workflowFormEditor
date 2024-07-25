import React, { useEffect, useState } from 'react';
import { useStore } from '../../formStore';
import { Form, Checkbox, Radio, Input, Button, Space, Switch } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './styles.less';

const CheckboxConfig = () => {
  const [form] = Form.useForm();
  const { activeItem, updateAttrs } = useStore();
  const [checkboxValue, setCheckboxValue] = useState([]);

  const update = () => {
    form.validateFields().then((formData) => {
      updateAttrs(activeItem.id, {
        label: formData.label,
        value: checkboxValue.map((el) => formData.options[el]?.label),
        options: formData.options.map((el) => ({
          label: el.label,
          value: el.label,
        })),
        direction: formData.direction,
        required: formData.required,
      });
    });
  };

  useEffect(() => {
    if (activeItem.id) {
      form.setFieldsValue(activeItem.attrs);
      const defaultCheckboxValue = activeItem.attrs.value.map((el) => {
        return activeItem.attrs.options.findIndex((op) => op.value === el);
      });
      setCheckboxValue(defaultCheckboxValue);
    }
  }, [activeItem.id]);

  useEffect(() => {
    update();
  }, [checkboxValue]);

  return (
    <Form form={form} layout="vertical" onValuesChange={update}>
      <Form.Item label="标签名" name="label">
        <Input />
      </Form.Item>

      <div className={styles.blockTitle}>选项列表</div>

      <Checkbox.Group
        onChange={(val) => setCheckboxValue(val)}
        value={checkboxValue}
        style={{ width: '100%' }}
      >
        <Form.List name="options" label="选项列表">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }, index) => (
                <Space
                  key={key}
                  style={{ display: 'flex', marginBottom: 8 }}
                  align="baseline"
                >
                  <Checkbox value={index}></Checkbox>
                  <Form.Item
                    {...restField}
                    name={[name, 'label']}
                    fieldKey={[fieldKey, 'labelKey']}
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
                    onClick={() => remove(name)}
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
      </Checkbox.Group>
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
