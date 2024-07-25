import React, { useState, useEffect } from 'react';
import { request, useLocation, history } from 'umi';
import { Modal, message, Form, Input, Alert } from 'antd';
import PassswordInput from './PasswordInput';
import JSEncrypt from 'jsencrypt';
import { parse } from 'query-string';
import styles from './styles.less';

const publicKey =
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCwCykgmu/7M7asypw3jOKPEoyw3qpeszQFqrjRMqAF475SDR7Va9GppFcCVVXUjKrGrYZcDKbbc5CNVVpPiu5YReKQRLFXg8pf2+Mc8ba/SxMfcpfjfis7/wNK0+HXRj6xqh9/UOOjnE859QzPJZjjLiXF5wDgPm7/3HK3wJaQcwIDAQAB';
const encryptRSA = new JSEncrypt();
encryptRSA.setPublicKey(publicKey);

const ChangePassword = ({ resetToken, onResetSuccess }) => {
  const { search } = useLocation();
  const query = parse(search);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const saveChange = async () => {
    const formData = await form.validateFields();

    if (formData.password !== formData.confirmPassword) {
      message.error('两次密码输入不一致');
      return;
    }

    const url = query.reset_token
      ? './API/public/passwords/change'
      : './API/public/activate';
    const method = query.reset_token ? 'PUT' : 'POST';
    const params = query.reset_token
      ? {
          resetToken: query.reset_token ?? resetToken,
          password: formData.password,
          lastPassword: formData.lastPassword,
        }
      : {
          activateToken: query.activate_token,
          username: formData.username,
          password: formData.password,
        };

    try {
      setLoading(true);
      const res = await request(url, {
        method,
        data: params,
      });

      setLoading(false);
      if (res.errCode === '0000') {
        message.success('密码设置成功');
        setVisible(false);
        // 重置密码成功后，手动清理掉路由上的token参数
        history.push('/login');
        onResetSuccess?.();
      }
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query.reset_token || query.activate_token || resetToken) {
      setVisible(true);
    }
  }, []);

  return (
    <>
      {!(query.reset_token || query.activate_token) && (
        <a onClick={() => setVisible(true)}>忘记密码</a>
      )}
      <Modal
        width={400}
        title="密码设置"
        open={visible}
        okText="确定"
        cancelText="取消"
        onOk={saveChange}
        onCancel={() => setVisible(false)}
        destroyOnClose
        confirmLoading={loading}
        bodyStyle={{ position: 'relative', paddingTop: 55 }}
      >
        {resetToken && (
          <Alert
            message="密码使用超过3个月，请重新设置"
            type="error"
            style={{ marginBottom: 10 }}
          />
        )}

        <div className={styles.nameBanner}>
          <span>姓名：</span>
          {query.username}
        </div>

        <Form form={form} layout="vertical" preserve={false}>
          {query.activate_token && (
            <Form.Item
              label="用户名"
              name="username"
              rules={[{ required: true, message: '用户名必填' }]}
            >
              <Input placeholder="请输入" maxLength={20} />
            </Form.Item>
          )}

          {query.reset_token && (
            <Form.Item
              label="原密码"
              name="lastPassword"
              rules={[{ required: true, message: '原密码必填' }]}
            >
              <Input.Password placeholder="请输入" />
            </Form.Item>
          )}
          <Form.Item
            label="新密码"
            name="password"
            rules={[
              { required: true, message: '新密码必填' },
              {
                pattern: new RegExp(
                  /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*,\._])[0-9a-zA-Z!@#$%^&*,\\._]{8,20}$/,
                ),
                message: '新密码输入格式有误',
              },
            ]}
            className={styles.noMessage}
          >
            <PassswordInput />
          </Form.Item>

          <Form.Item
            label="确认新密码"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '确认新密码必填' },

              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('确认密码必须和新密码相同'));
                },
              }),
            ]}
          >
            <Input.Password type="password" placeholder="请输入" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default React.memo(ChangePassword);
