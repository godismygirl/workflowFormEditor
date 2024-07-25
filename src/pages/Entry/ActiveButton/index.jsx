import React from 'react';
import { request } from 'umi';
import { Button, Modal, message } from 'antd';
import styles from './styles.less';

const ActiveButton = ({ isActive, appId, onSuccess }) => {
  const text = isActive ? '停用' : '启用';
  const url = isActive ? './PROD/apps/inactive' : './PROD/apps/active';

  const onAction = (e) => {
    e.stopPropagation();
    Modal.confirm({
      title: `确认${text}`,
      content: `确定要${text}该应用吗？`,
      okText: '确定',
      okType: isActive ? 'danger' : 'primary',
      cancelText: '取消',
      onOk: async () => {
        await request(url, {
          method: 'PUT',
          data: { id: appId },
        });
        message.success(`${text}成功`);
        onSuccess?.();
        return;
      },
    });
  };
  return <a onClick={onAction}>{text}</a>;
};

export default ActiveButton;
