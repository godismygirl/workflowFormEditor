import React, { useEffect, useState } from 'react';
import { useRequest, request, useLocation } from 'umi';
import { parse } from 'query-string';
import { Modal, Form, Space, Button, message } from 'antd';
import FormRender from '@/comps/FormRender';
import ProcessRender from '@/comps/ProcessRender';
import * as ActionButtons from '@/comps/ActionButtons';
import { ACTION_MAP } from '@/comps/ActionButtons/consts';
import styles from './styles.less';

const PortableDetail = () => {
  const { search } = useLocation();
  const query = parse(search);
  const [form] = Form.useForm();

  const { data } = useRequest(
    {
      url: './PROD/processes/details',
      params: { id: query?.processId },
    },
    {
      onSuccess: (d) => {
        form.setFieldsValue(d?.formData);
      },
    },
  );

  const { data: actionConfig } = useRequest({
    url: './PROD/tasks/models',
    params: { id: query?.taskId },
  });

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
    window.top?.proxy?.[query?.callback]?.();
  };

  return (
    <div className={styles.outterBox}>
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
          <ProcessRender processId={query?.processId} />
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
                  taskId={query?.taskId}
                  processId={query?.processId}
                  actionData={el}
                  startForm={form}
                  onCheck={onCheckMainForm}
                  onSuccess={onActionSuccess}
                  signature={actionConfig?.signRequired}
                  approvalConfig={
                    actionConfig?.nextDesignateRequiredNode?.approvalConfig
                  }
                />
              );
            }
          })}
        </Space>
      </div>
    </div>
  );
};

export default PortableDetail;
