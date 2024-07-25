import React, { useState, useEffect } from 'react';
import { useLocation } from 'umi';
import * as AntIcons from '@ant-design/icons';
import {
  HistoryOutlined,
  CheckOutlined,
  AuditOutlined,
  LinkOutlined,
  HighlightOutlined,
} from '@ant-design/icons';
import { history } from 'umi';
import { Menu } from 'antd';
import styles from './styles.less';

const menuData = [
  {
    label: '审批列表',
    key: 'DASHBORD',
    icon: <HistoryOutlined />,
    path: '/dashboard',
  },
  {
    label: '待我处理',
    key: 'TODO',
    icon: <HistoryOutlined />,
    path: '/todo-task',
  },
  {
    label: '已处理的',
    key: 'DONE',
    icon: <CheckOutlined />,
    path: '/done-task',
  },
  {
    label: '我发起的',
    key: 'INIT',
    icon: <AuditOutlined />,
    path: '/init-task',
  },
  {
    label: '抄送我的',
    key: 'CC',
    icon: <LinkOutlined />,
    path: '/cc-task',
  },
  {
    type: 'divider',
  },
  {
    label: '流程管理',
    key: 'ENTRY',
    icon: <HighlightOutlined />,
    path: '/entry',
  },
];

const MenHeyMenu = ({ mode = 'inline', theme = 'dark' }) => {
  const { pathname } = useLocation();
  const [selectedKeys, setSelectedKeys] = useState();

  const onSelectMenu = (data) => {
    setSelectedKeys(data.key);
    const path = data.item.props.path;
    if (path) {
      history.push(path);
    }
  };

  useEffect(() => {
    const target = menuData.find((el) => el.path === pathname);
    if (target) {
      setSelectedKeys(target.key);
    } else {
      setSelectedKeys(['DASHBOARD']);
      history.push('/dashboard');
    }
  }, [pathname]);

  return (
    <Menu
      theme={theme}
      mode={mode}
      selectedKeys={selectedKeys}
      onSelect={onSelectMenu}
      items={menuData}
      style={{ paddingTop: 3 }}
    />
  );
};

export default React.memo(MenHeyMenu);
