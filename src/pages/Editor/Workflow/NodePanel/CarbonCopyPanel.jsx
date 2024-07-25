import React, { useEffect, useState, useMemo } from 'react';
import { useModel } from 'umi';
import { Form, Radio, Space } from 'antd';
import { PanelHeader, ApproverPicker } from './comps';
import EmployeePicker from '@/comps/EmployeePicker';
import style from './style.less';

const ApproverPanel = ({ data }) => {
  const { nodeId, nodeType, nodeName, approvalConfig, fieldConfigs } = data;

  const { errorNodes, updateProcessNode } = useModel('useWorkflow');
  const [form] = Form.useForm();

  const hasError = useMemo(() => {
    const target = errorNodes.find((el) => el.nodeId === nodeId);
    return !!target;
  }, []);

  const saveNode = (_, formData) => {
    const nodeData = {
      approvalConfig: {
        ...formData.approver,
      },
    };

    updateProcessNode(nodeId, nodeData);
    //activeProcessNode(null);
  };

  useEffect(() => {
    //set value on panel show
    hasError && form.validateFields();
  }, [hasError]);

  useEffect(() => {
    if (nodeId) {
      form.setFieldsValue({
        //nodeName,
        approver: approvalConfig,
      });
    }
  }, [nodeId]);

  return (
    <>
      <div className={style.body}>
        <PanelHeader
          nodeId={nodeId}
          nodeType={nodeType}
          nodeName={nodeName}
          //color="#333"
        />
        <div className={style.headerDivider}></div>

        <Form form={form} onValuesChange={saveNode}>
          <div className={style.title}>设置抄送人</div>

          <Form.Item name="approver" rules={[{ required: true }]}>
            <ApproverPicker />
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default React.memo(ApproverPanel);
