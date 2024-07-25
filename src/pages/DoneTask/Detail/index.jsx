import React, { useEffect } from 'react';
import { useRequest, request } from 'umi';
import { Modal, Form, Button, Space } from 'antd';
import FormRender from '@/comps/FormRender';
import PrintBtn from '../PrintBtn';
import ProcessRender from '@/comps/ProcessRender';
import styles from './styles.less';

const Detail = ({ processId, open, onCancel }) => {
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

  const taskDetetable = () => {
    return (
      data?.processInstance?.processStatus === 'PROCESSING' &&
      data?.processModel?.flowConfig?.deletable
    );
  };

  useEffect(() => {
    if (open) {
      if (processId) getDetail();
    }
  }, [open]);

  return (
    <Modal
      title="详情"
      width={1200}
      open={open}
      onCancel={onCancel}
      destroyOnClose
      footer={
        data?.processInstance?.endTime ? (
          <Space>
            <Button onClick={onCancel}>取消</Button>
            <PrintBtn processId={processId} />
          </Space>
        ) : null
      }
    >
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
          <ProcessRender processId={processId} />
        </div>
      </div>
    </Modal>
  );
};

export default Detail;
