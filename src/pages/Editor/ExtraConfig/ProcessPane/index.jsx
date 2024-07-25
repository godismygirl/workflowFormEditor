import React, { useEffect } from 'react';
import { useModel } from 'umi';
import { Form } from 'antd';
import RevokeSwitch from './RevokeSwitch';
import ReduceApproverSwitch from './ReduceApproverSwitch';
import ReduceInitiatorSwitch from './ReduceInitiatorSwitch';
import { TAB_KEY } from '../..';
import styles from './styles.less';

const ProcessPane = ({ initData }) => {
  const { result, updateResult } = useModel('useSaveProgress');
  const { form } = Form.useForm();

  const onValuesChange = (v) => {
    updateResult({
      [TAB_KEY.CONFIG]: {
        ...result[TAB_KEY.CONFIG],
        ...v,
      },
    });
  };

  return (
    <Form form={form} initialValues={initData} onValuesChange={onValuesChange}>
      <Form.Item
        name="deletable"
        label="是否允许发起人撤销流程"
        valuePropName="checked"
      >
        <RevokeSwitch />
      </Form.Item>
      <Form.Item
        name="reducingByRepeatApprover"
        label="自动去重"
        valuePropName="checked"
      >
        <ReduceApproverSwitch />
      </Form.Item>
      <Form.Item name="reducingByInitiator" valuePropName="checked">
        <ReduceInitiatorSwitch />
      </Form.Item>
    </Form>
  );
};

export default React.memo(ProcessPane);
