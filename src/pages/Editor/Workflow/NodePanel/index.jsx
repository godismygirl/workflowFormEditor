import React from 'react';
import { useModel } from 'umi';
import { Drawer } from 'antd';
import { NODE_TYPE } from '../consts';
import StarterPanel from './StarterPanel';
import ApproverPanel from './ApproverPanel';
import ConnectorPanel from './ConnectorPanel';
import CarbonCopyPanel from './CarbonCopyPanel';
import ConditionPanel from './ConditionPanel';
import style from './style.less';

const NodePanel = () => {
  const { activeNode, activeProcessNode } = useModel('useWorkflow');

  const closeDrawer = () => {
    activeProcessNode(null);
  };

  const renderActivePanel = () => {
    if (!activeNode) return;

    switch (activeNode.nodeType) {
      case NODE_TYPE.APPROVER:
        return activeNode.nodeId === NODE_TYPE.START ? (
          <StarterPanel data={activeNode} />
        ) : (
          <ApproverPanel data={activeNode} />
        );

      case NODE_TYPE.COPY:
        return <CarbonCopyPanel data={activeNode} />;

      case NODE_TYPE.CONNECTOR:
        return <ConnectorPanel data={activeNode} />;

      case NODE_TYPE.CONDITION:
        return <ConditionPanel data={activeNode} />;

      default:
        return <></>;
    }
  };

  return (
    <Drawer
      mask={false}
      placement="right"
      closable={false}
      width={580}
      onClose={closeDrawer}
      open={!!activeNode}
      styles={{ body: { padding: 0 } }}
    >
      <div className={style.infoPanel}>{renderActivePanel()}</div>
    </Drawer>
  );
};

export default NodePanel;
