import React, { useEffect } from 'react';
import { useRequest, useLocation } from 'umi';
import { Modal, Form, Space, Button } from 'antd';
import FormRender from '@/comps/FormRender';
import { parse } from 'query-string';
import ProcessRender from '@/comps/ProcessRender';
import { Delete } from '@/comps/ActionButtons';
import PrintBtn from '@/pages/DoneTask/PrintBtn';
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
      onSuccess: (d) => {
        form.setFieldsValue(d?.formData);
      },
    },
  );

  const taskDetetable = () => {
    return (
      data?.processInstance?.processStatus === 'PROCESSING' &&
      data?.processModel?.flowConfig?.deletable
    );
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
            readOnly
          />
        </div>
        <div className={styles.process}>
          <ProcessRender processId={query?.processId} />
        </div>
      </div>

      <div className={styles.footer}>
        <Space>
          {taskDetetable() && (
            <Delete
              processId={data?.processInstance?.id}
              onSuccess={() => {
                window.top?.proxy?.[query?.callback]?.();
              }}
            />
          )}
          {data?.processInstance?.endTime && (
            <PrintBtn processId={query.processId} />
          )}
        </Space>
      </div>
    </div>
  );
};

export default Detail;
