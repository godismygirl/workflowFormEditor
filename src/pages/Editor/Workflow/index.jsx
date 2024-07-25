import React, { useState, useEffect } from 'react';
import { useModel } from 'umi';
import { ClockCircleOutlined } from '@ant-design/icons';
import StartNode from './StartNode';
import ApproverNode from './ApproverNode';
import ConnectorNode from './ConnectorNode';
import ConditionNode from './ConditionNode';
import DueConditionNode from './DueConditionNode';
import RouteNode from './RouteNode';
import SplitBtn from './SplitBtn';
import Zoom from '@/comps/Zoom';
import NodePanel from './NodePanel';
import { NODE_TYPE } from './consts';
import { TAB_KEY } from '..';
import styles from './styles.less';

const ProcessMap = ({ data }) => {
  const [mapScale, setMapScale] = useState(1);
  const { process, validateProcess } = useModel('useWorkflow');
  const { open, updateResult, updateStatus } = useModel('useSaveProgress');

  const renderChild = (child) => {
    const { nodeId, nodeName, nodeType } = child;

    switch (child.nodeType) {
      case NODE_TYPE.APPROVER:
      case NODE_TYPE.COPY:
        return (
          <>
            <ApproverNode
              nodeId={nodeId}
              nodeName={nodeName}
              nodeType={nodeType}
              approvalConfig={child.approvalConfig}
              hasDueRoute={child.dueCondition}
            />
            {child.childNode && renderChild(child.childNode)}
          </>
        );

      case NODE_TYPE.CONNECTOR:
        return (
          <>
            <ConnectorNode
              nodeId={nodeId}
              nodeName={nodeName}
              nodeType={nodeType}
              approvalConfig={child.approvalConfig}
              connectRules={child.connectRules}
            />
            {child.childNode && renderChild(child.childNode)}
          </>
        );

      case NODE_TYPE.ROUTE:
        return (
          <>
            {child.conditions && renderConditions(child)}
            <RouteNode nodeId={nodeId} nodeName={nodeName} />
            {child.childNode && renderChild(child.childNode)}
          </>
        );

      case NODE_TYPE.DUE_ROUTE:
        return (
          <>
            {child.conditions && renderDueConditions(child)}
            <RouteNode nodeId={nodeId} nodeName={nodeName} />
            {child.childNode && renderChild(child.childNode)}
          </>
        );

      default:
    }
  };

  const renderConditions = (route) => {
    const tail = route.conditions.length - 1;
    return (
      <>
        <div className={styles.branchWrapper}>
          <div className={styles.branch}>
            <SplitBtn nodeId={route.nodeId} />
            {route.conditions.map((el, i) => {
              const { nodeId, nodeName, condition, defaultCondition } = el;

              return (
                <div className={styles.col} key={nodeId}>
                  {i === 0 && (
                    <>
                      <i className={styles.topLeftCover}></i>
                      <i className={styles.bottomLeftCover}></i>
                    </>
                  )}
                  {i === tail && (
                    <>
                      <i className={styles.topRightCover}></i>
                      <i className={styles.bottomRightCover}></i>
                    </>
                  )}
                  <ConditionNode
                    nodeName={nodeName}
                    nodeId={nodeId}
                    conditionIndex={i}
                    condition={condition}
                    defaultCondition={defaultCondition}
                  />
                  {el.childNode && renderChild(el.childNode)}
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };

  const renderDueConditions = (route) => {
    const tail = route.conditions.length - 1;

    return (
      <>
        <div className={styles.branchWrapper}>
          <div className={styles.branch}>
            <i className={styles.timeout}>
              <ClockCircleOutlined />
            </i>
            {route.conditions.map((el, i) => {
              const { nodeId, nodeName, defaultCondition } = el;

              return (
                <div className={styles.col} key={nodeId}>
                  {i === 0 && (
                    <>
                      <i className={styles.topLeftCover}></i>
                      <i className={styles.bottomLeftCover}></i>
                    </>
                  )}
                  {i === tail && (
                    <>
                      <i className={styles.topRightCover}></i>
                      <i className={styles.bottomRightCover}></i>
                    </>
                  )}
                  <DueConditionNode
                    nodeName={nodeName}
                    nodeId={nodeId}
                    defaultCondition={defaultCondition}
                  />
                  {el.childNode && renderChild(el.childNode)}
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };

  const validate = () => {
    const valid = validateProcess();

    if (valid) {
      updateStatus({
        [TAB_KEY.WORKFLOW]: 'finish',
      });
      updateResult({
        [TAB_KEY.WORKFLOW]: process,
      });
    } else {
      updateStatus({
        [TAB_KEY.WORKFLOW]: 'error',
      });
    }
  };

  useEffect(() => {
    //打开保存窗时校验
    if (open) {
      validate();
    }
  }, [open]);

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.mapContainer}
        style={{
          minWidth: 'min-content',
          transform: `scale(${mapScale})`,
          transformOrigin: '50% 0px 0px',
        }}
      >
        <div className={styles.map}>
          <StartNode nodeId={process.nodeId} />
          {process.childNode && renderChild(process.childNode)}
          <div className={styles.taskEnd}>
            <i className={styles.endIcon}>结束</i>
          </div>
        </div>
      </div>

      <NodePanel
        style={{ position: 'absolute', zIndex: 10, top: 90, right: 35 }}
        onChange={(s) => setMapScale(s)}
      />
    </div>
  );
};

export default React.memo(ProcessMap);
