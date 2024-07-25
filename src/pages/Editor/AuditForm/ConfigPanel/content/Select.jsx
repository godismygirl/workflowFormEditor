import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Form, Input, Button, Space, Radio } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './styles.less';

const InputConfig = () => {
  const [form] = Form.useForm();
  const { activeItem, updateAttrs } = useModel('useFormLayout');
  const [radioValue, setRadioValue] = useState(0);
  const onRadioChange = (e) => {
    setRadioValue(e.target.value);
  };

  const update = () => {
    form.validateFields().then((formData) => {
      updateAttrs(activeItem.id, {
        label: formData.label,
        value: formData.options[radioValue]?.label,
        status: formData.status,
        placeholder: formData.placeholder,
        options: formData.options.map((el) => ({
          label: el.label,
          value: el.label,
        })),
        marginBottom: formData.marginBottom,
      });
    });
  };

  useEffect(() => {
    form.setFieldsValue(activeItem?.attrs);
    const defaultRadioValue = activeItem.attrs.options.findIndex(
      (el) => el.value === activeItem.attrs.value,
    );
    setRadioValue(defaultRadioValue);
  }, [activeItem.id]);

  return (
    <Form form={form} layout="vertical" onValuesChange={update}>
      <Form.Item label="标签名" name="label">
        <Input />
      </Form.Item>
      <Form.Item
        label="空白提示"
        name="placeholder"
        rules={[
          { required: true, message: '空白提示必填' },
          { type: 'string', whitespace: true, message: '只能包含文字' },
        ]}
      >
        <Input />
      </Form.Item>

      <div className={styles.blockTitle}>选项列表</div>
      <Radio.Group onChange={onRadioChange} value={radioValue}>
        <Form.List name="options">
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

                  <MinusCircleOutlined onClick={() => remove(name)} />
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
    </Form>
  );
};

export default React.memo(InputConfig);
