import React, { useCallback, useMemo } from 'react';
import { useModel } from 'umi';
import { Button, Space } from 'antd';
import {
  UserOutlined,
  CloseOutlined,
  RightOutlined,
  PaperClipOutlined,
} from '@ant-design/icons';
import AddNodeBtn from '../AddNodeBtn';
import { APPROVAL_MAP, NODE_TYPE } from '../consts';
import styles from './styles.less';

const ApproverNode = ({
  nodeId,
  nodeName,
  nodeType,
  approvalConfig,
  hasDueRoute,
}) => {
  const { errorNodes, activeNode, activeProcessNode, removeApprover } =
    useModel('useWorkflow');
  const isActive = activeNode?.nodeId === nodeId;
  const isError = errorNodes.find((el) => el.nodeId === nodeId);

  const tagClass = useMemo(() => {
    let classStr = styles.tag;
    if (isError) classStr += ' ' + styles.errorTag;
    if (isActive) classStr += ' ' + styles.activeTag;

    return classStr;
  }, [isActive, isError]);

  const renderResult = (config) => {
    const pre = APPROVAL_MAP[config.key];
    const end = config?.approvalObjects?.map((el) => el.name)?.join('，');
    const res = end ? pre + '：' + end : pre;
    return res;
  };

  const removeNode = (e) => {
    e.stopPropagation();
    removeApprover(nodeId);
  };

  const showNodePanel = () => {
    activeProcessNode(nodeId);
  };

  return (
    <div className={styles.box}>
      <div className={tagClass} onClick={showNodePanel}>
        <div className={styles.header}>
          <i className={styles.icon}>
            {nodeType === NODE_TYPE.COPY ? (
              <PaperClipOutlined />
            ) : (
              <UserOutlined />
            )}
            <UserOutlined />
          </i>
          <span className={styles.name} title={nodeName}>
            {nodeName}
          </span>
        </div>
        <div className={styles.body}>
          {approvalConfig?.key ? (
            <span className={styles.hasResult}>
              {renderResult(approvalConfig)}
            </span>
          ) : (
            <span className={styles.noResult}>
              {nodeType === NODE_TYPE.COPY ? '请设置抄送人' : '请设置审批人'}
            </span>
          )}

          <i className={styles.arrow}>
            <RightOutlined />
          </i>
        </div>
        <Space className={styles.toolbar}>
          <div className={styles.delBtn} onClick={removeNode}>
            <CloseOutlined style={{ fontSize: 12, color: '#fff' }} />
          </div>
        </Space>
      </div>
      <AddNodeBtn nodeId={nodeId} hideAction={hasDueRoute} />
    </div>
  );
};

export default React.memo(ApproverNode);
