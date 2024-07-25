import React, { useState, useRef } from 'react';
import { request } from 'umi';
import { Popup, Form, Notify, Button } from 'react-vant';
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

    if (loading) return;

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
      Notify.show({ type: 'success', message: '拒绝成功' });
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
      <Button type="primary" block round onClick={onClickButton}>
        {actionData?.text ?? '拒绝'}
      </Button>
      <Popup
        title={actionData?.text ?? '拒绝'}
        className={styles.pop}
        style={{ height: '100%' }}
        visible={open}
        position="bottom"
        closeable
        onClose={() => setOpen(false)}
      >
        <div className={styles.container}>
          <FormRender
            form={renderForm}
            mode="MOBILE"
            cols={1}
            layout={formLayout}
          />
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
          <div className={styles.footer}>
            <Button type="danger" block round loading={loading} onClick={save}>
              确定
            </Button>
          </div>
        </div>
      </Popup>
    </>
  );
};

export default React.memo(DenyButton);
