import React, { useState, useRef } from 'react';
import Signature from '@/comps/Signature';
import { request } from 'umi';
import { Button, Modal, Form, Input, message } from 'antd';
import FormRender from '@/comps/FormRender';
import styles from './styles.less';

const DenyButton = ({ taskId, actionData, onSuccess, signature }) => {
  //const [signForm] = Form.useForm();
  const [renderForm] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const formLayout = actionData?.formModel?.fields;

  const save = async () => {
    if (!taskId) {
      console.error('taskId not provide');
    }

    const renderFormData = await renderForm.validateFields();
    setLoading(true);
    const res = await request('./PROD/tasks/deny', {
      method: 'POST',
      data: {
        id: taskId,
        subForm: {
          actionId: actionData.actionId,
          subFormData: renderFormData,
        },
        //signature,
      },
    }).catch(() => setLoading(false));
    setLoading(true);

    if (res?.errCode === '0000') {
      message.success('拒绝成功');
      setOpen(false);
      onSuccess?.();
    }
  };

  const onClickButton = () => {
    if (!signature && !formLayout?.length > 0) {
      save();
    } else {
      setOpen(true);
    }
  };

  return (
    <>
      <Button type="primary" onClick={onClickButton}>
        {actionData?.text ?? '拒绝'}
      </Button>
      <Modal
        title={actionData?.text ?? '拒绝'}
        width={600}
        open={open}
        onCancel={() => setOpen(false)}
        confirmLoading={loading}
        onOk={save}
        okText="确定"
        cancelText="取消"
      >
        <FormRender form={renderForm} cols={1} layout={formLayout} />
        {/* <Form form={form} layout="vertical">
          {signature && (
            <Form.Item
              label="签名"
              name="signature"
              rules={[{ required: true, message: '签名必须' }]}
            >
              <Signature width={550} height={300} />
            </Form.Item>
          )}
        </Form> */}
      </Modal>
    </>
  );
};

export default React.memo(DenyButton);
