import React, { useEffect, useState } from 'react';
import { useRequest, request, history, useModel, useLocation } from 'umi';
import { Form, Input, Button, Checkbox, Alert, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { getCookie, setCookie, delCookie } from '@/utils/cookie';
import JSEncrypt from 'jsencrypt';
import { parse } from 'query-string';
import ChangePassword from './ChangePassword';
import styles from './styles.less';

const publicKey =
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCwCykgmu/7M7asypw3jOKPEoyw3qpeszQFqrjRMqAF475SDR7Va9GppFcCVVXUjKrGrYZcDKbbc5CNVVpPiu5YReKQRLFXg8pf2+Mc8ba/SxMfcpfjfis7/wNK0+HXRj6xqh9/UOOjnE859QzPJZjjLiXF5wDgPm7/3HK3wJaQcwIDAQAB';
const encryptRSA = new JSEncrypt();
encryptRSA.setPublicKey(publicKey);

const getRememberUser = () => {
  const username = getCookie('REMEMBER_USERNAME');
  const password = getCookie('REMEMBER_PASSWORD');
  return [username, password];
};

const setRememberUser = (username, password) => {
  setCookie('REMEMBER_USERNAME', username);
  setCookie('REMEMBER_PASSWORD', password);
};

export const delRememberUser = () => {
  delCookie('REMEMBER_USERNAME');
  delCookie('REMEMBER_PASSWORD');
};

const ActionForm = ({ showCaptcha, encryptType }) => {
  const { search } = useLocation();
  const query = parse(search);
  const { fetchUserInfo } = useModel('useUser');

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [canResetPwd, setCanResetPwd] = useState(false);
  const [resetToken, setResetToken] = useState();

  const startLogin = async (values) => {
    const password = encryptRSA.encrypt(values.password);

    try {
      setLoading(true);
      const res = await request('./API/v2api/common/Login', {
        method: 'post',
        headers: {
          Authorization: `Basic ${window.btoa(
            'clientId0880BEA5A24D466BA35E08AA:c046CF40280F84D798386785A7B85EB5',
          )}`,
          'Content-Type': 'application/json;charset=UTF-8',
        },
        data: {
          login_name: values.username,
          login_password: password,
          passwordEncryptType: 'RSA',
        },
        skipErrorHandler: true,
      });

      setLoading(false);

      //登录成功
      sessionStorage.setItem('ACCESS_TOKEN', res.data.access_token);
      sessionStorage.setItem('REFRESH_TOKEN', res.data.refresh_token);

      await fetchUserInfo();
      // sessionStorage.setItem(
      //   'ACCESS_TOKEN',
      //   'vsxqSGpxi1-W9BQDOlN0LTLbDua6vRWDSR2rRCIYXP9zWMj0tOXhuxfsPlcCB7kRioRSvMZ43b7TX_iUHTPQVzJRoiFmilPovprZXzQGdNxmHrcF3eqOYWzq7XdIB4ol',
      // );

      message.success('登录成功');

      history.push(query.redirect_from ?? '/dashboard');
    } catch (error) {
      setLoading(false);
      console.log(error);
      message.error(error?.response?.data?.desc ?? '登录失败');

      if (error.reset_token) {
        setResetToken(error.reset_token);
      }
    }

    const remember = form.getFieldValue('remember');
    if (remember) {
      setRememberUser(values.username, values.password);
    } else {
      delRememberUser();
    }
  };

  useEffect(() => {
    const [rUsername, rPassword] = getRememberUser();
    //console.log(rUsername, rPassword)
    if (rUsername && rPassword) {
      form.setFieldsValue({
        username: rUsername,
        password: rPassword,
      });
    }
  }, []);

  return (
    <Form form={form} className={styles.loginForm} onFinish={startLogin}>
      {/* {!!error && !loading && (
        <Alert message={errorMsg} type="error" showIcon />
      )} */}
      <Form.Item
        name="username"
        rules={[{ required: true, message: '请输入用户名!' }]}
      >
        <Input
          prefix={<UserOutlined style={{ color: '#bbb' }} />}
          size="large"
          placeholder="请输入用户名"
          disabled={loading}
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: '请输入密码!' }]}
      >
        <Input.Password
          prefix={<LockOutlined style={{ color: '#bbb' }} />}
          size="large"
          type="password"
          placeholder="请输入密码"
          disabled={loading}
        />
      </Form.Item>
      <div style={{ textAlign: 'justify' }}>
        <Form.Item
          name="remember"
          valuePropName="checked"
          initialValue={true}
          noStyle
        >
          <Checkbox>记住我</Checkbox>
        </Form.Item>
        {/* <ChangePassword resetToken={resetToken} /> */}
      </div>

      <Form.Item style={{ marginTop: 15 }}>
        <Button
          type="primary"
          size="large"
          htmlType="submit"
          className={styles.loginButton}
          loading={loading}
        >
          登 录
        </Button>
      </Form.Item>
    </Form>
  );
};

export default React.memo(ActionForm);
