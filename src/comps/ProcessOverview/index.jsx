import React, { useState, useEffect } from 'react';
import {
  UserOutlined,
  PushpinOutlined,
  PaperClipOutlined,
  CheckOutlined,
  ApiOutlined,
} from '@ant-design/icons';
import { Radio } from 'antd';
import { NODE_TYPE, NEED_SIGN_MODEL } from '@/pages/Editor/Workflow/consts';
import styles from './styles.less';

const getDefaultRouteIndex = (data) => {
  let result = {};
  if (!data) return result;
  const loop = (d) => {
    if (
      d.nodeType === NODE_TYPE.ROUTE ||
      d.nodeType === NODE_TYPE.DUE_CONDITION
    ) {
      result[d.nodeId] = 0;
      d.conditions.map((c) => loop(c));
      return;
    }

    if (d.childNode) {
      loop(d.childNode);
    }
  };

  loop(data);
  return result;
};

const ProcessOverview = ({ process }) => {
  const [activeRouteIndex, setActiveRouteIndex] = useState({});

  const getAvatar = (type, nodeId) => {
    if (nodeId === NODE_TYPE.START) {
      return (
        <i className={styles.avatar} style={{ background: '#666' }}>
          <UserOutlined />
        </i>
      );
    }

    switch (type) {
      case NODE_TYPE.APPROVER:
        return (
          <i className={styles.avatar}>
            <PushpinOutlined />
          </i>
        );

      case NODE_TYPE.COPY:
        return (
          <i className={styles.avatar}>
            <PaperClipOutlined />
          </i>
        );
      //连接器不渲染
      // case NODE_TYPE.CONNECTOR:
      //   return (
      //     <i className={styles.avatar} style={{ background: '#f39c13' }}>
      //       <ApiOutlined />
      //     </i>
      //   );

      case NODE_TYPE.ROUTE:
      case NODE_TYPE.DUE_ROUTE:
        return <i className={styles.routeAvatar}></i>;
      default:
    }
  };

  const renderNode = (data, isConditionChild) => {
    if (!data) {
      if (isConditionChild) {
        return;
      }

      return (
        <div className={styles.row}>
          <div className={styles.endIcon}>
            <i className={styles.avatar} style={{ background: '#27ae60' }}>
              <CheckOutlined />
            </i>
          </div>
          <div className={styles.nodeName}>结束</div>
        </div>
      );
    }

    if (
      data?.nodeType === NODE_TYPE.ROUTE ||
      data?.nodeType === NODE_TYPE.DUE_ROUTE
    ) {
      return (
        <>
          <div className={styles.row}>
            <div className={styles.icon}>
              {getAvatar(data.nodeType, data.nodeId)}
            </div>
            <div>
              <Radio.Group
                optionType="button"
                buttonStyle="solid"
                size="small"
                options={data?.conditions?.map((el) => ({
                  label: el.nodeName,
                  value: el.nodeId,
                }))}
                defaultValue={data?.conditions?.[0]?.nodeId}
                onChange={(e) => {
                  const conditionId = e.target.value;
                  const index = data.conditions.findIndex(
                    (el) => el.nodeId === conditionId,
                  );
                  setActiveRouteIndex({
                    ...activeRouteIndex,
                    [data.nodeId]: index,
                  });
                }}
              />
            </div>
          </div>

          {renderNode(
            data?.conditions?.[activeRouteIndex[data.nodeId]]?.childNode,
            true,
          )}

          {renderNode(data?.childNode, isConditionChild)}
        </>
      );
    }

    //连接器不渲染，直接渲染连接器下级
    if (data?.nodeType === NODE_TYPE.CONNECTOR) {
      return <>{renderNode(data?.childNode, isConditionChild)}</>;
    }

    return (
      <>
        <div className={styles.row}>
          <div className={styles.icon}>
            {getAvatar(data.nodeType, data.nodeId)}
          </div>
          <div>{data.nodeName}</div>
        </div>
        {renderNode(data?.childNode, isConditionChild)}
      </>
    );
  };

  useEffect(() => {
    if (process) {
      const di = getDefaultRouteIndex(process);
      setActiveRouteIndex(di);
    }
  }, [process]);

  return <div>{renderNode(process)}</div>;
};

export default React.memo(ProcessOverview);
