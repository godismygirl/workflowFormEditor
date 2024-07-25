import React from 'react';
import { useRequest, useLocation, history } from 'umi';
import ActionForm from './ActionForm';
import { delRememberUser } from './ActionForm';
import './style.less';

export { delRememberUser };

const LoginPage = () => {
  return (
    <div className="login-bg">
      <div className="login-banner" />
      <div className="login-area">
        <h2 className="site-title">消防值守平台</h2>
        <div className="login-panel">
          <h3 className="welcome-title">你好，欢迎登录</h3>
          <ActionForm showCaptcha={false} encryptType="RSA" />
        </div>
      </div>
      <div className="version">v1.0.0</div>
    </div>
  );
};

export default React.memo(LoginPage);
