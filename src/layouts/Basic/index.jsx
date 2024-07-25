import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import User from './User';
import Menu from './Menu';
import styles from './styles.less';
import { Outlet } from 'umi';

const { Header, Content, Sider } = Layout;

const BasicLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.icon}></div>
          <span className={styles.title}>应用流程管理</span>
        </div>
        <User />
      </Header>

      <Layout className={styles.layout}>
        {/* <Sider
          className={styles.sider}
          trigger={null}
          collapsible
          collapsedWidth={50}
          collapsed={collapsed}
        >
          <Menu theme="light" mode="inline" />
        </Sider> */}
        <Content className={styles.main}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default React.memo(BasicLayout);
