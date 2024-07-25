import React, { useState, useEffect } from 'react';
import {
  HighlightOutlined,
  UserOutlined,
  ApartmentOutlined,
  PaperClipOutlined,
  ApiOutlined,
} from '@ant-design/icons';
import { useModel } from 'umi';
import { NODE_TYPE } from '../../../consts';
import { CloseOutlined } from '@ant-design/icons';
import { Input, message } from 'antd';
import styles from './styles.less';

const PanelHeader = ({ nodeId, nodeType, nodeName, color, readOnly }) => {
  const [name, setName] = useState(nodeName);
  const { updateProcessNode, activeProcessNode } = useModel('useWorkflow');

  const onValueChange = (e) => {
    const t = e.target.value;
    setName(t);
    updateProcessNode(nodeId, {
      nodeName: t,
    });
  };

  const renderIcon = () => {
    switch (nodeType) {
      case NODE_TYPE.START:
      case NODE_TYPE.APPROVER:
        return <UserOutlined />;
      case NODE_TYPE.CONNECTOR:
        return <ApiOutlined />;
      case NODE_TYPE.CONDITION:
        return <ApartmentOutlined />;
      case NODE_TYPE.COPY:
        return <PaperClipOutlined />;
      default:
    }
  };

  useEffect(() => {
    if (nodeId) {
      setName(nodeName);
    }
  }, [nodeId]);

  return (
    <div className={styles.box}>
      <div className={styles.iconCol}>
        <i className={styles.icon} style={{ background: color }}>
          {renderIcon()}
        </i>
      </div>
      <div className={styles.nameEdit}>
        <Input
          placeholder="请输入"
          suffix={readOnly ? null : <HighlightOutlined />}
          value={name}
          onChange={onValueChange}
          readOnly={readOnly}
          bordered={!readOnly}
        ></Input>
      </div>
      <div className={styles.close} onClick={() => activeProcessNode(null)}>
        <CloseOutlined />
      </div>
    </div>
  );
};

export default PanelHeader;
