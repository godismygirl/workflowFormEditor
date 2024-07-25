import React, { useState, useEffect } from 'react';
import { request, useRequest } from 'umi';
import { Popup, Form, Notify, Button } from 'react-vant';
import FormRender from '@/comps/FormRender';
import Signature from '@/comps/Signature';
import ProcessRender from '@/comps/ProcessRender';
import styles from './styles.less';

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

    if (loading) return;

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
      Notify.show({ type: 'success', message: '驳回成功' });
      setOpen(false);
      onSuccess?.();
    }
  };

  return (
    <>
      <Button type="primary" block round onClick={() => setOpen(true)}>
        {actionData?.text ?? '驳回'}
      </Button>
      <Popup
        title={actionData?.text ?? '驳回'}
        visible={open}
        position="bottom"
        closeable
        className={styles.pop}
        onClose={() => setOpen(false)}
      >
        <div className={styles.container}>
          <FormRender
            mode="MOBILE"
            form={renderForm}
            cols={1}
            layout={formLayout}
          />
          <Form form={nodeForm} layout="vertical">
            <Form.Item
              name="targetNodeId"
              rules={[{ required: true, message: '驳回节点必填' }]}
            >
              <ProcessRender processId={processId} selectable />
            </Form.Item>
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

export default React.memo(RollbackButton);
