import React, { useState, useEffect, useRef } from 'react';
import { useRequest, request } from 'umi';
import { Modal, Form, message } from 'antd';
import FormRender from '@/comps/FormRender';
import ProcessOverview from '@/comps/ProcessOverview';
import ApproverAssignModal from './ApproverAssignModal';
import styles from './styles.less';

const StartModal = ({ appId, open, onCancel, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [assignInfo, setAssignInfo] = useState({ open: false, approvers: [] });

  const { data: actionConfig, run: getTaskModel } = useRequest(
    {
      url: './PROD/apps/models',
      params: { appId, nodeId: 'START' },
    },
    {
      manual: true,
    },
  );

  const { data, run } = useRequest(
    { url: './PROD/apps', params: { id: appId } },
    {
      manual: true,
    },
  );

  const submit = async () => {
    await form.validateFields();
    const approvalConfig =
      actionConfig?.nextDesignateRequiredNode?.approvalConfig;
    if (approvalConfig?.key === 'LAST_NODE_DESIGNATED') {
      //需要先选择下级审批人
      setAssignInfo({
        open: true,
        approvers: approvalConfig?.approvalObjects,
      });
      return;
    } else {
      startTask();
    }
  };

  const startTask = async ({ nextApprovers }) => {
    try {
      const formData = await form.validateFields();
      setLoading(true);
      const res = await request('./PROD/apps/start', {
        method: 'POST',
        data: {
          id: appId,
          formData,
          nextCandidates: nextApprovers,
        },
      });
      setLoading(false);

      if (res?.errCode === '0000') {
        message.success('发起成功');
        onCancel?.();
        onSuccess?.();
      }
    } catch (error) {
      setLoading(false);
      message.error('请检查表单必填项');
    }
  };

  useEffect(() => {
    if (appId) {
      run();
      getTaskModel();
    }
  }, [appId]);

  return (
    <>
      <Modal
        title="发起流程"
        open={open}
        okText="发起流程"
        cancelText="取消"
        width={1000}
        centered
        onCancel={onCancel}
        onOk={submit}
        confirmLoading={loading}
        maskClosable={false}
        destroyOnClose
      >
        <div className={styles.container}>
          <div className={styles.formCol}>
            <FormRender
              mode="DESKTOP"
              layout={data?.formModel?.fields}
              fieldConfigs={data?.processModel?.nodeModel?.fieldConfigs}
              form={form}
              cols={1}
            />
          </div>
          <div className={styles.proccessCol}>
            <ProcessOverview process={data?.processModel?.nodeModel} />
          </div>
        </div>
      </Modal>
      <ApproverAssignModal
        {...assignInfo}
        onCancel={() => setAssignInfo({ open: false, approvers: [] })}
        onSuccess={startTask}
      />
    </>
  );
};

export default React.memo(StartModal);
