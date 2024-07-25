import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useModel } from 'umi';
import { Form, Button, Space, Radio } from 'antd';
import { PanelHeader, ButtonConfig } from './comps';
import PropSettings from './comps/PropSettings';
import styles from './style.less';

const StarterPanel = ({ data }) => {
  const { updateProcessNode } = useModel('useWorkflow');
  const { nodeName, nodeId, fieldConfigs } = data;
  const [form] = Form.useForm();
  const [configType, setConfiType] = useState('BASIC');

  const saveNode = async (_, formData) => {
    const nodeData = {
      actions: formData.actions,
      approvalConfig: {
        key: 'INITIATOR_PRIVILEGE',
        approvalObjects: formData.startOrg,
      },
    };

    updateProcessNode(nodeId, nodeData);
  };

  useEffect(() => {
    if (nodeId) {
      form.setFieldsValue({
        actions: data?.actions,
        startOrg: data?.approvalConfig?.approvalObjects,
      });
    }
  }, [nodeId]);

  return (
    <>
      <div className={styles.body}>
        <PanelHeader
          nodeId={nodeId}
          nodeType={data.nodeType}
          nodeName={nodeName}
          color="#333"
          readOnly
        />
        <div className={styles.headerDivider} required={true}></div>
        <div className={styles.title}>字段权限</div>

        {/* <Form form={form} onValuesChange={saveNode}>
          <div className={styles.switch}>
            <Radio.Group
              className={styles.radioGroup}
              value={configType}
              onChange={(e) => setConfiType(e.target.value)}
              optionType="button"
              buttonStyle="solid"
              options={[
                { label: '基本设置', value: 'BASIC' },
                { label: '字段权限', value: 'AUTH' },
              ]}
            />
          </div>
          {configType === 'BASIC' && (
            <>
              <div className={styles.divider}></div>
              <Form.Item name="actions">
                <ButtonConfig />
              </Form.Item>
            </>
          )}
        </Form> */}
        {/* {configType === 'AUTH' && ( */}
        <PropSettings nodeId={nodeId} config={fieldConfigs} startNode />
        {/* )} */}
      </div>
    </>
  );
};

export default React.memo(StarterPanel);
