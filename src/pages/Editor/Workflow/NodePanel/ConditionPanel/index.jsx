import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useModel } from 'umi';
import { Form, Button, Select } from 'antd';
import { PanelHeader, CopyConfig } from '../comps';
import {
  MinusCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { NEED_SIGN_MODEL } from '../../consts';
import RuleSelect from './RuleSelect';
import style from '../style.less';

const ConditionPanel = ({ data }) => {
  const { nodeName, nodeId, condition, defaultCondition } = data;

  const { updateProcessNode } = useModel('useWorkflow');

  const saveNode = (v) => {
    const nodeData = {
      condition: {
        conditionType: 'AND',
        rules: [v],
      },
    };
    updateProcessNode(nodeId, nodeData);
  };

  return (
    <>
      <div className={style.body}>
        <PanelHeader
          nodeId={nodeId}
          nodeType={data.nodeType}
          nodeName={nodeName}
          color="#f60"
        />
        <div className={style.headerDivider}></div>
        {defaultCondition ? (
          <div>默认其他情况进入此分支 (该分支不可编辑和删除)</div>
        ) : (
          <>
            <div className={style.sectionHeader}>条件设置</div>
            <RuleSelect value={condition?.rules?.[0]} onChange={saveNode} />
          </>
        )}
      </div>
    </>
  );
};

export default React.memo(ConditionPanel);
