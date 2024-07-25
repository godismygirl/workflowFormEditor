import React, { useState } from 'react';
import Signature from '@/comps/Signature';
import { request } from 'umi';
import { Space, Button, message, Modal, Form } from 'antd';
import ApproverAssignModal from '@/pages/Entry/StartModal/ApproverAssignModal';
import FormRender from '@/comps/FormRender';
import styles from './styles.less';

const Confirm = ({
  taskId,
  actionData,
  startForm,
  signature,
  approvalConfig,
  onCheck,
  onSuccess,
}) => {
  const [renderForm] = Form.useForm();
  const [signForm] = Form.useForm();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assignInfo, setAssignInfo] = useState({ open: false, approvers: [] });

  const formLayout = actionData?.formModel?.fields;

  const agree = async ({ signature, nextApprovers }) => {
    const renderFormData = await renderForm.validateFields();
    const startFormData = await startForm?.validateFields();

    try {
      setLoading(true);
      const res = await request('./PROD/tasks/complete', {
        method: 'POST',
        data: {
          id: taskId,
          subForm: {
            actionId: actionData.actionId,
            subFormData: renderFormData,
          },
          formData: startFormData,
          nextCandidates: nextApprovers,
          signature,
        },
      });
      setLoading(false);

      if (res?.errCode === '0000') {
        message.success('同意成功');
        setOpen(false);
        onSuccess?.();
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const onOk = async () => {
    const formData = await signForm.validateFields();
    if (approvalConfig?.key === 'LAST_NODE_DESIGNATED') {
      setAssignInfo({ open: true, approvers: approvalConfig?.approvalObjects });
      return;
    }

    agree({ signature: formData.signature });
  };

  const onClickAgree = async () => {
    await onCheck?.();
    if (!signature && !formLayout?.length > 0) {
      if (approvalConfig?.key === 'LAST_NODE_DESIGNATED') {
        setAssignInfo({
          open: true,
          approvers: approvalConfig?.approvalObjects,
        });
        return;
      }
      agree({ signature: null });
    } else {
      setOpen(true);
    }
  };

  return (
    <>
      <Button type="primary" loading={loading} onClick={onClickAgree}>
        {actionData?.text ?? '同意'}
      </Button>
      <Modal
        title={actionData?.text ?? '同意'}
        width={600}
        open={open}
        // okText="确定"
        // cancelText="取消"
        footer={
          <Space>
            <Button
              onClick={() => {
                renderForm.resetFields();
                signForm.resetFields();
              }}
            >
              清空
            </Button>
            <Button type="primary" onClick={onOk}>
              确定
            </Button>
          </Space>
        }
        onOk={onOk}
        onCancel={() => setOpen(false)}
      >
        <FormRender form={renderForm} cols={1} layout={formLayout} />
        {signature && (
          <Form layout="vertical" form={signForm}>
            <Form.Item
              label="签名"
              name="signature"
              rules={[{ required: true, message: '签名必填' }]}
            >
              <Signature height={250} />
            </Form.Item>
          </Form>
        )}
      </Modal>
      <ApproverAssignModal
        {...assignInfo}
        onCancel={() => setAssignInfo({ open: false, approvers: [] })}
        onSuccess={agree}
      />
    </>
  );
};

export default Confirm;
