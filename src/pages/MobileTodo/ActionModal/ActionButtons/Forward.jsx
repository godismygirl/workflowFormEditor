import React, { useState } from 'react';
import { request } from 'umi';
import { Popup, Form, Notify, Button } from 'react-vant';
import FormRender from '@/comps/FormRender';
import EmployeePicker from '@/comps/FormRender/MobileRender/MobileComps/EmployeePicker';
import styles from './styles.less';

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

    if (loading) return;

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
      Notify.show({ type: 'success', message: '转发成功' });
      setOpen(false);
      onSuccess?.();
    }
  };

  return (
    <>
      <Button type="primary" block round onClick={() => setOpen(true)}>
        {actionData?.text ?? '转交'}
      </Button>
      <Popup
        title={actionData?.text ?? '转交'}
        className={styles.pop}
        style={{ height: '100%' }}
        visible={open}
        position="bottom"
        closeable
        onClose={() => setOpen(false)}
      >
        <div className={styles.container}>
          <FormRender
            mode="MOBILE"
            form={renderForm}
            cols={1}
            layout={formLayout}
          />
          <Form form={userForm} preserve={false}>
            <Form.Item
              label="转交人"
              name="user"
              rules={[{ required: true, message: '转交人必选' }]}
            >
              <EmployeePicker multiple />
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
            <Button type="danger" block round loading={loading} onClick={save}>
              确定
            </Button>
          </div>
        </div>
      </Popup>
    </>
  );
};

export default React.memo(ForwardButton);
