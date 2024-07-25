import React, { useState } from 'react';
import { request } from 'umi';
import Signature from '@/comps/Signature';
import { Button, Modal, Form, Input, message } from 'antd';
import FormRender from '@/comps/FormRender';
import EmployeePicker from '@/comps/EmployeePicker';

const ForwardButton = ({ taskId, actionData, onSuccess, signature }) => {
  const [userForm] = Form.useForm();
  const [renderForm] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const formLayout = actionData?.formModel?.fields;

  const save = async () => {
    if (!taskId) {
      console.error('taskId not provide');
    }

    const userformData = await userForm.validateFields();
    const renderFormData = await renderForm.validateFields();

    setLoading(true);
    const res = await request('./PROD/tasks/forward', {
      method: 'POST',
      data: {
        id: taskId,
        targetUserId: userformData.user?.[0]?.id,
        subForm: {
          actionId: actionData.actionId,
          subFormData: renderFormData,
        },
        //signature: userformData.signature,
      },
    });
    setLoading(false);

    if (res?.errCode === '0000') {
      message.success('转发成功');
      setOpen(false);
      onSuccess?.();
    }
  };

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        {actionData?.text ?? '转交'}
      </Button>
      <Modal
        title={actionData?.text ?? '转交'}
        open={open}
        width={600}
        onCancel={() => setOpen(false)}
        confirmLoading={loading}
        onOk={save}
        destroyOnClose
        okText="确定"
        cancelText="取消"
      >
        <FormRender form={renderForm} cols={1} layout={formLayout} />
        <Form form={userForm} layout="vertical" preserve={false}>
          <Form.Item
            label="转交人"
            name="user"
            rules={[{ required: true, message: '转交人必选' }]}
          >
            <EmployeePicker />
          </Form.Item>
          {/* {signature && (
            <Form.Item
              label="签名"
              name="signature"
              rules={[{ required: true, message: '签名必须' }]}
            >
              <Signature width={550} height={300} />
            </Form.Item>
          )} */}
        </Form>
      </Modal>
    </>
  );
};

export default React.memo(ForwardButton);
