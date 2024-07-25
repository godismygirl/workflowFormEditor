import React, { useState, useEffect } from 'react';
import { useLocation, useModel, history, Outlet } from 'umi';
import { parse } from 'query-string';
import { Spin } from 'antd';

const SecurityLayout = () => {
  const { pathname, search } = useLocation();
  const query = parse(search);

  const [isLogin, setIsLogin] = useState(false);

  const { fetchUserInfo } = useModel('useUser');

  const accessToken = sessionStorage.getItem('ACCESS_TOKEN');
  //const refreshToken = sessionStorage.getItem('REFRESH_TOKEN');

  const securityCheck = async () => {
    if (query.access_token) {
      //外部网页带token跳转过来
      sessionStorage.setItem('ACCESS_TOKEN', query.access_token);
      sessionStorage.setItem('REFRESH_TOKEN', query.refresh_token);
      if (query.tenant_code)
        sessionStorage.setItem('TENANT_CODE', query.tenant_code);
      //const res = await fetchUserInfo();
      setIsLogin(true);
    } else {
      if (accessToken) {
        setIsLogin(true);
      } else {
        //要跳去登录页
        history.replace({
          pathname: '/login',
          search: pathname === '/' ? '' : `?redirect_from=${pathname}`,
        });
      }
    }
  };

  useEffect(() => {
    securityCheck();
  }, []);

  if (isLogin) {
    return <Outlet />;
  } else {
    return (
      <Spin
        size="large"
        style={{
          position: 'fixed',
          zIndex: 10,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
    );
  }
};

export default React.memo(SecurityLayout);
