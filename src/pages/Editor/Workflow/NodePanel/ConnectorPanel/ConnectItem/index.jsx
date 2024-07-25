import React from 'react';
import { Switch, Space, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './styles.less';

const ConnectItem = ({ name, enabled, onSwitch, onEdit, onDelete }) => {
  return (
    <div className={styles.box}>
      <div className={styles.inner}>
        <div className={styles.header}>{name}</div>
        <div className={styles.body}>
          <div className={styles.row}>
            <div className={styles.label}>条件</div>
            <div className={styles.value}>流程节点到达</div>
          </div>
          <div className={styles.row}>
            <div className={styles.label}>动作</div>
            <div className={styles.value}>生成目的表单并推送数据</div>
          </div>
        </div>
        <div className={styles.footer}>
          <div className={styles.switch}>
            <Switch
              checked={enabled}
              checkedChildren="启用"
              unCheckedChildren="停用"
              onChange={(checked) => onSwitch?.(checked)}
            />
          </div>

          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={onEdit}
              title="编辑"
            ></Button>
            <Button
              type="primary"
              danger
              size="small"
              title="删除"
              icon={<DeleteOutlined />}
              onClick={onDelete}
            ></Button>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default ConnectItem;
