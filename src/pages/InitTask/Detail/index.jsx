import React, { useEffect } from 'react';
import { useRequest, request } from 'umi';
import { Modal, Form, Space, Button } from 'antd';
import { Delete } from '@/comps/ActionButtons';
import FormRender from '@/comps/FormRender';
import ProcessRender from '@/comps/ProcessRender';
import PrintBtn from '@/pages/DoneTask/PrintBtn';
import styles from './styles.less';

const Detail = ({ processId, open, onCancel, afterDelete }) => {
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
      footer={
        data?.processInstance?.endTime ? (
          <Space>
            <Button onClick={onCancel}>取消</Button>
            <PrintBtn processId={processId} />
          </Space>
        ) : null
      }
      destroyOnClose
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
      {taskDetetable() && (
        <div className={styles.footer}>
          <Delete
            processId={data?.processInstance?.id}
            onSuccess={() => {
              getDetail();
              afterDelete?.();
            }}
          />
        </div>
      )}
    </Modal>
  );
};

export default Detail;
