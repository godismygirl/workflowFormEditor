import React, { useEffect } from 'react';
import { useModel } from 'umi';
import { Form, Input, Switch } from 'antd';
import styles from './styles.less';

const SectionConfig = () => {
  const [form] = Form.useForm();
  const { activeItem, updateAttrs } = useModel('useFormLayout');

  const update = () => {
    form.validateFields().then((formData) => {
      updateAttrs(activeItem.id, {
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
    <Form
      form={form}
      layout="vertical"
      onChange={update}
      onValuesChange={update}
    >
      <div className={styles.idBox}>
        <div>组件ID：</div>
        <div>{activeItem?.id}</div>
      </div>
      <Form.Item
        label="标题"
        name="label"
        rules={[{ required: true, message: '标题不能为空' }]}
      >
        <Input placeholder="请输入标题" />
      </Form.Item>
      <Form.Item label="是否隐藏标题" name="showLabel" valuePropName="checked">
        <Switch checkedChildren="是" unCheckedChildren="否" />
      </Form.Item>
      <Form.Item label="是否必填" name="required" valuePropName="checked">
        <Switch checkedChildren="是" unCheckedChildren="否" />
      </Form.Item>
    </Form>
  );
};

export default React.memo(SectionConfig);
