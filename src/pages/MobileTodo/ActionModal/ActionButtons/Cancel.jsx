import React, { useState } from 'react';
import { request } from 'umi';
import { Popup, Form, Input, Button, Notify } from 'react-vant';
import styles from './styles.less';

const DenyButton = ({ processId, onSuccess, signature }) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const save = async () => {
    if (!processId) {
      console.error('taskId not provide');
    }

    if (loading) return;

    const formData = await form.validateFields();
    setLoading(true);
    const res = await request('./PROD/processes', {
      method: 'DELETE',
      data: {
        id: processId,
        reason: formData.reason,
      },
    }).catch(() => setLoading(false));
    setLoading(true);

    if (res?.errCode === '0000') {
      Notify.show({ type: 'success', message: '撤销成功' });
      setOpen(false);
      onSuccess?.();
    }
  };

  return (
    <>
      <Button type="danger" block round onClick={() => setOpen(true)}>
        撤销
      </Button>
      <Popup
        title="撤销流程"
        visible={open}
        className={styles.pop}
        style={{ height: '100%' }}
        position="bottom"
        closeable
        onClose={() => setOpen(false)}
      >
        <div className={styles.container}>
          <Form form={form} layout="vertical">
            <Form.Item
              name="reason"
              label="撤销原因"
              rules={[{ required: true, message: '拒绝原因必填' }]}
            >
              <Input.TextArea placeholder="请输入拒绝原因" />
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
          <div className={styles.footer}>
            <Button type="danger" block round onClick={save}>
              确定
            </Button>
          </div>
        </div>
      </Popup>
    </>
  );
};

export default React.memo(DenyButton);
