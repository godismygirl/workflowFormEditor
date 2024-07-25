import React, { useState } from 'react';
import Signature from '@/comps/Signature';
import { request } from 'umi';
import { Popup, Form, Notify, Button } from 'react-vant';
import { Space } from 'antd';
import FormRender from '@/comps/FormRender';
import styles from './styles.less';

const Confirm = ({
  taskId,
  actionData,
  startForm,
  signature,
  onCheck,
  onSuccess,
}) => {
  const [renderForm] = Form.useForm();
  const [signForm] = Form.useForm();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const formLayout = actionData?.formModel?.fields;

  const agree = async (signature) => {
    if (loading) return;
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
          signature,
        },
      });
      setLoading(false);

      if (res?.errCode === '0000') {
        Notify.show({ type: 'success', message: '同意成功' });
        setOpen(false);
        onSuccess?.();
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const onOk = async () => {
    const formData = await signForm.validateFields();
    agree(formData.signature);
  };

  const onClickAgree = async () => {
    await onCheck?.();
    if (!signature && !formLayout?.length > 0) {
      agree();
    } else {
      setOpen(true);
    }
  };

  return (
    <>
      <Button
        type="primary"
        block
        round
        loading={loading}
        onClick={onClickAgree}
      >
        {actionData?.text ?? '同意'}
      </Button>
      <Popup
        title={actionData?.text ?? '同意'}
        className={styles.pop}
        visible={open}
        style={{ height: '100%' }}
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
          {signature && (
            <Form layout="vertical" form={signForm}>
              <Form.Item
                label="签名"
                name="signature"
                rules={[{ required: true, message: '签名必填' }]}
              >
                <Signature />
              </Form.Item>
            </Form>
          )}
          <div className={styles.footer}>
            <Space>
              <Button
                type="default"
                block
                round
                onClick={() => {
                  renderForm.resetFields();
                  signForm.resetFields();
                }}
              >
                清空
              </Button>
              <Button type="primary" block round onClick={onOk}>
                确定
              </Button>
            </Space>
          </div>
        </div>
      </Popup>
    </>
  );
};

export default Confirm;
