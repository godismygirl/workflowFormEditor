import React, { useEffect, useState } from 'react';
import { useRequest, request } from 'umi';
import { Modal, Form, Space, Button, message } from 'antd';
import FormRender from '@/comps/FormRender';
import ProcessRender from '@/comps/ProcessRender';
import * as ActionButtons from '@/comps/ActionButtons';
import { ACTION_MAP } from '@/comps/ActionButtons/consts';
import StartModal from '@/pages/Entry/StartModal';
import styles from './styles.less';

const ActionModal = ({ processId, taskId, open, onCancel, onSuccess }) => {
  const [form] = Form.useForm();

  const { data, run: getDetail } = useRequest(
    {
      url: './PROD/processes/details',
      params: { id: processId },
    },
    {
      manual: true,
      onSuccess: (d) => {
        form.setFieldsValue(d?.formData);
      },
    },
  );

  const { data: actionConfig, run: getActionConfig } = useRequest(
    {
      url: './PROD/tasks/models',
      params: { id: taskId },
    },
    {
      manual: true,
    },
  );

  const onCheckMainForm = () => {
    return new Promise((resovle, reject) => {
      form
        .validateFields()
        .then(() => resovle())
        .catch(() => {
          message.error('请检查表单必填项');
          reject();
        });
    });
  };

  const onActionSuccess = () => {
    onCancel?.();
    onSuccess?.();
  };

  useEffect(() => {
    if (open) {
      if (processId) {
        getDetail();
      }
      if (taskId) {
        getActionConfig();
      }
    }
  }, [open]);

  return (
    <Modal
      title="立即处理"
      width={1200}
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      destroyOnClose
    >
      <div className={styles.box}>
        <div className={styles.form}>
          <FormRender
            mode="DESKTOP"
            cols={1}
            layout={data?.formModel?.fields}
            form={form}
            fieldConfigs={actionConfig?.fieldConfigs}
          />
        </div>
        <div className={styles.process}>
          <ProcessRender processId={processId} />
        </div>
      </div>
      <div className={styles.footer}>
        <Space>
          {actionConfig?.actions?.map((el, index) => {
            if (el.show) {
              const Comp = ActionButtons[ACTION_MAP[el.action]];

              return (
                <Comp
                  key={el.actionId}
                  taskId={taskId}
                  processId={processId}
                  actionData={el}
                  startForm={form}
                  signature={actionConfig?.signRequired}
                  approvalConfig={
                    actionConfig?.nextDesignateRequiredNode?.approvalConfig
                  }
                  onCheck={onCheckMainForm}
                  onSuccess={onActionSuccess}
                />
              );
            }
          })}
        </Space>
      </div>
    </Modal>
  );
};

export default ActionModal;
