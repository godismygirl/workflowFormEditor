import React, { useEffect, useState } from 'react';
import { useRequest, request, history, useLocation } from 'umi';
import { parse } from 'query-string';
import { Popup, Form, Notify, Tabs, Button } from 'react-vant';
import FormRender from '@/comps/FormRender';
import ProcessOverview from '@/comps/ProcessOverview';
import styles from './styles.less';

const Detail = () => {
  const [loading, setLoading] = useState(false);
  const { search } = useLocation();
  const query = parse(search);
  const [form] = Form.useForm();

  const { data } = useRequest({
    url: './PROD/apps',
    params: { id: query.appId },
  });

  const startTask = async () => {
    if (loading) return;
    try {
      const formData = await form.validateFields();
      setLoading(true);
      const res = await request('./PROD/apps/start', {
        method: 'POST',
        data: {
          id: query.appId,
          formData,
        },
      });
      setLoading(false);
      if (res?.errCode === '0000') {
        Notify.show({ type: 'success', message: '发起成功' });
        history.replace('/mobile-dashboard');
      }
    } catch (error) {
      setLoading(false);
      Notify.show({ type: 'danger', message: '发起失败' });
    }
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
              fieldConfigs={data?.processModel?.nodeModel?.fieldConfigs}
              form={form}
            />
          </Tabs.TabPane>
          <Tabs.TabPane key="process" title="流程">
            <ProcessOverview process={data?.processModel?.nodeModel} />
          </Tabs.TabPane>
        </Tabs>
      </div>
      <div className={styles.footer}>
        <Button
          loading={loading}
          type="primary"
          block
          round
          onClick={startTask}
        >
          发起流程
        </Button>
      </div>
    </div>
  );
};

export default Detail;
