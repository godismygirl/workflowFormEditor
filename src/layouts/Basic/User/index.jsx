import React, { useState } from 'react';
import { request, history, useModel } from 'umi';
import { Modal, message, Dropdown } from 'antd';
import {
  LockOutlined,
  LogoutOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import PersonalInfo from './PersonalInfo';
import ResetPassword from './ResetPassword';
import { delRememberUser } from '@/pages/Login';
import styles from './styles.less';

const User = () => {
  const { userInfo } = useModel('useUser');

  const logout = () => {
    Modal.confirm({
      title: '确定要退出系统吗？',
      icon: <ExclamationCircleOutlined />,
      content: '退出系统后将自动跳转至登录页',
      onOk: () => {
        sessionStorage.clear();
        message.success('您已安全退出');
        sessionStorage.clear();
        delRememberUser();
        history.replace('/login');
      },
      okText: '确定',
      onCancel() {},
      cancelText: '取消',
    });
  };

  return (
    <div className={styles.headerRight}>
      <Dropdown
        placement="bottomRight"
        menu={{
          items: [
            {
              key: '0',
              label: <PersonalInfo name={userInfo?.userName} />,
              icon: <UserOutlined />,
            },
            {
              key: '1',
              label: <ResetPassword onSuccess={logout} />,
              icon: <LockOutlined />,
            },
            {
              type: 'divider',
            },
            {
              key: '3',
              label: <a onClick={logout}>退出登录</a>,
              icon: <LogoutOutlined />,
            },
          ],
        }}
        trigger={['hover']}
      >
        <div className={styles.user}>
          <div className={styles.icon}>
            <UserOutlined />
          </div>
          <div className={styles.name}>{userInfo?.userName}</div>
        </div>
      </Dropdown>
    </div>
  );
};

export default React.memo(User);
