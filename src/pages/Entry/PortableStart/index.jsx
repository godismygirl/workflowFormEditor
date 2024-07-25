import React, { useState, useEffect, useRef } from 'react';
import { useRequest, request, useLocation } from 'umi';
import { parse } from 'query-string';
import { Button, Form, message } from 'antd';
import FormRender from '@/comps/FormRender';
import ProcessOverview from '@/comps/ProcessOverview';
import styles from './styles.less';

const PortableStart = () => {
  const { search } = useLocation();
  const query = parse(search);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const { data } = useRequest({
    url: './PROD/apps',
    params: { id: query?.appId },
  });

  const startTask = async () => {
    const formData = await form.validateFields();
    try {
      setLoading(true);
      const res = await request('./PROD/apps/start', {
        method: 'POST',
        data: {
          id: query?.appId,
          formData,
        },
      });
      setLoading(false);
      if (res?.errCode === '0000') {
        message.success('发起成功');
        window.top?.proxy?.[query?.callback]?.();
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className={styles.outterBox}>
      <div className={styles.container}>
        <div className={styles.formCol}>
          <FormRender
            mode="DESKTOP"
            layout={data?.formModel?.fields}
            fieldConfigs={data?.processModel?.nodeModel?.fieldConfigs}
            form={form}
            cols={1}
          />
        </div>
        <div className={styles.proccessCol}>
          <ProcessOverview process={data?.processModel?.nodeModel} />
        </div>
      </div>
      <div className={styles.footer}>
        <Button loading={loading} type="primary" onClick={startTask}>
          发起申请
        </Button>
      </div>
    </div>
  );
};

export default React.memo(PortableStart);
