import React, { useState, useEffect } from 'react';
import { request, useRequest } from 'umi';
import { Button, Modal, Form, Input, message } from 'antd';
import FormRender from '@/comps/FormRender';
import Signature from '@/comps/Signature';
import ProcessRender from '@/comps/ProcessRender';

const RollbackButton = ({
  taskId,
  processId,
  actionData,
  onSuccess,
  signature,
}) => {
  const [nodeForm] = Form.useForm();
  const [renderForm] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const formLayout = actionData?.formModel?.fields;

  const save = async () => {
    if (!taskId) {
      console.error('taskId not provide');
    }

    const nodeFormData = await nodeForm.validateFields();
    const renderFormData = await renderForm.validateFields();

    setLoading(true);
    const res = await request('./PROD/tasks/rollback', {
      method: 'POST',
      data: {
        id: taskId,
        targetNodeId: nodeFormData.targetNodeId,
        subForm: {
          actionId: actionData.actionId,
          subFormData: renderFormData,
        },
        //signature: nodeFormData.signature,
      },
    }).catch(() => setLoading(false));
    setLoading(true);

    if (res?.errCode === '0000') {
      message.success('驳回成功');
      setOpen(false);
      onSuccess?.();
    }
  };

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        {actionData?.text ?? '驳回'}
      </Button>
      <Modal
        title={actionData?.text ?? '驳回'}
        open={open}
        width={600}
        onCancel={() => setOpen(false)}
        confirmLoading={loading}
        onOk={save}
        okText="确定"
        cancelText="取消"
      >
        <div
          style={{ maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden' }}
        >
          <FormRender form={renderForm} cols={1} layout={formLayout} />
          <Form form={nodeForm} layout="vertical">
            <Form.Item
              name="targetNodeId"
              rules={[{ required: true, message: '驳回节点必填' }]}
            >
              <ProcessRender processId={processId} selectable />
            </Form.Item>
            {/* {signature && (
              <Form.Item
                label="签名"
                name="signature"
                rules={[{ required: true, message: '签名必须' }]}
              >
                <Signature width={535} height={300} />
              </Form.Item>
            )} */}
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default React.memo(RollbackButton);
