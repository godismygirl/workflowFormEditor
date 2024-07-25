import React, { useState } from 'react';
import { request, useModel } from 'umi';
import { Form, Input, message } from 'antd';
import { Modal } from 'antd';

const ResetPassword = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const save = async () => {
    const formData = await form.validateFields();

    try {
      setLoading(true);
      const res = await request('./API/security/passwords/change', {
        method: 'put',
        data: {
          password: formData.password,
          lastPassword: formData.lastPassword,
        },
      });
      setLoading(false);
      if (res.errCode === '0000') {
        message.success('修改密码成功');
        setOpen(false);
        onSuccess?.();
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <>
      <a onClick={() => setOpen(true)}>修改密码</a>
      <Modal
        open={open}
        title="修改密码"
        okText="保存"
        cancelText="取消"
        onCancel={() => setOpen(false)}
        onOk={save}
        confirmLoading={loading}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="原密码"
            name="lastPassword"
            rules={[{ required: true, message: '原密码必填' }]}
          >
            <Input.Password placeholder="请输入" />
          </Form.Item>
          <Form.Item
            label="新密码"
            name="password"
            rules={[{ required: true, message: '新密码必填' }]}
          >
            <Input.Password placeholder="请输入" />
          </Form.Item>
          <Form.Item
            label="确认新密码"
            name="repeatPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '确认新密码必填' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次新密码输入不一致'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请输入" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default React.memo(ResetPassword);
