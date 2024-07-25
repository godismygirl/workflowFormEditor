import React, { useEffect, useState, useMemo } from 'react';
import { useModel } from 'umi';
import { Form, Alert, Space, Modal } from 'antd';
import { PanelHeader, ApproverPicker } from '../comps';
import AddBtn from './AddBtn';
import ConnectItem from './ConnectItem';
import EditPop from './EditPop';
import styles from './styles.less';

const ConnectorPanel = ({ data }) => {
  const { nodeId, nodeType, nodeName, connectRules } = data;

  const [info, setInfo] = useState({
    open: false,
    type: null,
    data: null,
  });

  const { errorNodes, updateProcessNode } = useModel('useWorkflow');
  const [form] = Form.useForm();

  const hasError = useMemo(() => {
    const target = errorNodes.find((el) => el.nodeId === nodeId);
    return !!target;
  }, []);

  const onSaveRule = (rule) => {
    let result = connectRules ?? [];
    const existIndex = result?.findIndex((el) => el.id === rule.id);
    if (existIndex !== -1) {
      result[existIndex] = rule;
    } else {
      result.push(rule);
    }

    const nodeData = {
      connectRules: [...result],
    };
    updateProcessNode(nodeId, nodeData);
  };

  const toggleRule = (checked, ruleId) => {
    const existIndex = connectRules?.findIndex((el) => el.id === ruleId);
    if (existIndex !== -1) {
      connectRules[existIndex].enabled = checked;
    }

    const nodeData = {
      connectRules: [...connectRules],
    };
    updateProcessNode(nodeId, nodeData);
  };

  const deleteRule = (ruleId) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除规则吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        const result = connectRules?.filter((el) => el.id !== ruleId);
        const nodeData = {
          connectRules: [...result],
        };
        updateProcessNode(nodeId, nodeData);
      },
    });
  };

  useEffect(() => {
    //set value on panel show
    hasError && form.validateFields();
  }, [hasError]);

  useEffect(() => {
    if (nodeId) {
      form.setFieldsValue({
        //nodeName,
        connectRules: connectRules,
      });
    }
  }, [nodeId]);

  return (
    <>
      <div className={styles.body}>
        <PanelHeader
          nodeId={nodeId}
          nodeType={nodeType}
          nodeName={nodeName}
          color="#27ae60"
        />
        <div className={styles.headerDivider}></div>
        <Alert
          style={{ padding: 15 }}
          message="表单连接器说明"
          description={
            <>
              <div className={styles.row}>
                1.一个规则只能连接一个表单，如本表单需要连接多个其它表单，请为待连接的每个表单各建立一个规则
              </div>
              <div className={styles.row}>
                2.多个连接规则将会按照设定的前后顺序，依次触发
              </div>
              <div className={styles.row}>
                3.目的表单必须为已发布状态才可以设置连接到源数据表单
              </div>
            </>
          }
          type="info"
          showIcon
        />
        <div className={styles.container}>
          {connectRules?.map((el) => (
            <ConnectItem
              key={el.id}
              name={el.name}
              enabled={el.enabled}
              onSwitch={(checked) => toggleRule(checked, el.id)}
              onEdit={() =>
                setInfo({
                  open: true,
                  type: el.appConnector ? 'app' : 'api',
                  data: el,
                })
              }
              onDelete={() => deleteRule(el.id)}
            />
          ))}
          <AddBtn
            onClick={(t) => setInfo({ open: true, type: t, data: null })}
          />
        </div>
      </div>
      <EditPop
        {...info}
        onClose={() => setInfo({ open: false, type: null, data: null })}
        onSave={onSaveRule}
      />
    </>
  );
};

export default ConnectorPanel;
