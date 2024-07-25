import React, { useState } from 'react';
import { request } from 'umi';
import Signature from '@/comps/Signature';
import { Button, Modal, Form, Input, message } from 'antd';

const DenyButton = ({ processId, onSuccess, signature }) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const save = async () => {
    if (!processId) {
      console.error('taskId not provide');
      return;
    }

    const formData = await form.validateFields();
    try {
      setLoading(true);
      const res = await request('./PROD/processes', {
        method: 'DELETE',
        data: {
          id: processId,
          reason: formData.reason,
          //signature: formData.signature,
        },
      }).catch(() => setLoading(false));
      setLoading(true);

      if (res?.errCode === '0000') {
        message.success('撤销成功');
        setOpen(false);
        onSuccess?.();
      }
    } catch (error) {
      setOpen(false);
    }
  };

  return (
    <>
      <Button type="primary" danger onClick={() => setOpen(true)}>
        撤销
      </Button>
      <Modal
        title="撤销流程"
        open={open}
        width={600}
        centered
        onCancel={() => setOpen(false)}
        confirmLoading={loading}
        onOk={save}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="reason"
            label="撤销原因"
            rules={[{ required: true, message: '撤销原因必填' }]}
          >
            <Input.TextArea placeholder="请输入撤销原因" />
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

export default React.memo(DenyButton);
