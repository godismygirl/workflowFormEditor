import React, { useEffect } from 'react';
import { useStore } from '../../formStore';
import { Form, Input, InputNumber, Switch } from 'antd';

const UploadConfig = () => {
  const [form] = Form.useForm();
  const hasTemplate = Form.useWatch('hasTemplate', form);
  const { activeItem, updateAttrs } = useStore();

  const update = async () => {
    const formData = await form.validateFields();
    updateAttrs(activeItem.id, {
      ...formData,
      limitSize: formData.limitSize * 1000000,
    });
  };

  useEffect(() => {
    if (activeItem.id) {
      form.setFieldsValue({
        ...activeItem?.attrs,
        limitSize: activeItem?.attrs?.limitSize / 1000000,
      });
    }
  }, [activeItem.id]);

  return (
    <Form form={form} layout="vertical" onValuesChange={update}>
      <Form.Item label="标题名称" name="label">
        <Input style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        label="提示文字"
        name="placeholder"
        initialValue={activeItem?.attrs?.placeholder}
      >
        <Input style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item label="数量限制" name="maxCount">
        <InputNumber min={1} max={5} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item label="大小限制" name="limitSize">
        <InputNumber
          min={1}
          max={1000}
          style={{ width: '100%' }}
          addonAfter="MB"
        />
      </Form.Item>
      <Form.Item label="是否必填" name="required" valuePropName="checked">
        <Switch checkedChildren="是" unCheckedChildren="否" />
      </Form.Item>
      <Form.Item
        label="是否提供摸板文件"
        name="hasTemplate"
        valuePropName="checked"
      >
        <Switch checkedChildren="是" unCheckedChildren="否" />
      </Form.Item>
      {hasTemplate && (
        <>
          <Form.Item
            label="文件下载链接"
            name="templateSrc"
            //rules={[{ required: true, message: '文件下载链接必填' }]}
          >
            <Input placeholder="请输入链接地址" maxLength={200} />
          </Form.Item>
          <Form.Item
            label="模板显示名称"
            name="templateName"
            //rules={[{ required: true, message: '模板显示名称必填' }]}
          >
            <Input placeholder="请输入模板显示名称" maxLength={20} />
          </Form.Item>
        </>
      )}
    </Form>
  );
};

export default React.memo(UploadConfig);
