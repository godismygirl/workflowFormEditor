import React, { useEffect, useMemo } from 'react';
import { useModel } from 'umi';
import { Form } from 'antd';
import TitleTemplate from './TitleTemplate';
import TipFields from './TipFeilds';
import { TAB_KEY } from '../..';
import styles from './styles.less';

const DataDisplayPane = ({ initData }) => {
  const { layout } = useModel('useFormLayout');
  const { result, updateResult } = useModel('useSaveProgress');
  const { form } = Form.useForm();

  const defaultTips = [
    { id: 'initiator', name: '申请人' },
    { id: 'initiatorOrg', name: '申请单位' },
    { id: 'startTime', name: '申请时间' },
  ];

  const onValuesChange = (v) => {
    if (!v.tipFields) return;

    updateResult({
      [TAB_KEY.CONFIG]: {
        ...result[TAB_KEY.CONFIG],
        noticeConfig: {
          defaultTemplate: true,
          tipFields: v.tipFields,
        },
      },
    });
  };

  useEffect(() => {
    //formLayout改变的时候，重新set default
    if (layout && form) {
      form.setFieldsValue({ tipFields: defaultTips });
    }
  }, [layout]);

  return (
    <Form
      form={form}
      initialValues={{ tipFields: initData?.tipFields ?? defaultTips }}
      onValuesChange={onValuesChange}
    >
      <Form.Item label="标题设置" name="titleTemplate">
        <TitleTemplate />
      </Form.Item>
      <Form.Item label="摘要设置" name="tipFields" shouldUpdate={true}>
        <TipFields />
      </Form.Item>
    </Form>
  );
};

export default React.memo(DataDisplayPane);
