import React, { useEffect } from 'react';
import { useRequest, history, useLocation } from 'umi';
import { parse } from 'query-string';
import { Popup, Form, Notify, Tabs } from 'react-vant';
import { Cancel } from '@/pages/MobileTodo/ActionModal/ActionButtons';
import FormRender from '@/comps/FormRender';
import ProcessRender from '@/comps/ProcessRender';
import styles from './styles.less';

const Detail = () => {
  const { search } = useLocation();
  const query = parse(search);
  const [form] = Form.useForm();

  const { data } = useRequest(
    {
      url: './PROD/processes/details',
      params: { id: query.processId },
    },
    {
      //ready: !!query.processId,
      onSuccess: (d) => {
        form.setFieldsValue(d?.formData);
      },
    },
  );

  const taskDeletable = () => {
    return (
      data?.processInstance?.processStatus === 'PROCESSING' &&
      data?.processModel?.flowConfig?.deletable
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <Tabs type="card">
          <Tabs.TabPane key="form" title="表单">
            <FormRender
              mode="MOBILE"
              cols={1}
              layout={data?.formModel?.fields}
              form={form}
              readOnly
            />
          </Tabs.TabPane>
          <Tabs.TabPane key="process" title="流程">
            <ProcessRender processId={query.processId} />
          </Tabs.TabPane>
        </Tabs>
      </div>
      {taskDeletable() && query.action !== 'no' && (
        <div className={styles.footer}>
          <Cancel
            processId={data?.processInstance?.id}
            onSuccess={() => history.replace('/mobile-init')}
          />
        </div>
      )}
    </div>
  );
};

export default Detail;
