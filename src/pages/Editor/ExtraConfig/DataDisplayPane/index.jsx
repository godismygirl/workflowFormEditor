import React from 'react';
import { useModel } from 'umi';
import { Form } from 'antd';
import KeyInfoSelect from './KeyInfoSelect';
import { TAB_KEY } from '../..';
import styles from './styles.less';

const DataDisplayPane = ({ initData }) => {
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
      <Form.Item name="tagFieldId" label="关键信息自定义">
        <KeyInfoSelect />
      </Form.Item>
    </Form>
  );
};

export default React.memo(DataDisplayPane);
