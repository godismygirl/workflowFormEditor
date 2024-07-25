import React, { useEffect } from 'react';
import { useModel } from 'umi';
import { Form, Switch } from 'antd';
import SignatureSwitch from './SignatureSwitch';
import { COMP_NAMES } from '@/pages/Editor/AuditForm/consts';
import { Tabs } from 'antd';
import { TAB_KEY } from '..';
import ProcessPane from './ProcessPane';
import DataDisplayPane from './DataDisplayPane';
import MessagePane from './MessagePane';
import styles from './styles.less';

const ExtraConfig = ({ data }) => {
  const { open, updateStatus } = useModel('useSaveProgress');

  const validate = async () => {
    updateStatus({
      [TAB_KEY.CONFIG]: 'finish',
    });
  };

  useEffect(() => {
    //打开保存窗时校验
    if (open) {
      setTimeout(() => {
        validate();
      });
    }
  }, [open]);

  // useEffect(() => {
  //   if (data) {
  //     const touched = form.isFieldTouched('tipFields');

  //     if (!touched) {
  //       form.setFieldsValue(data);
  //     }
  //   }
  // }, [data]);

  return (
    <div className={styles.container}>
      <Tabs
        tabPosition="left"
        items={[
          {
            label: '流程高级设置',
            key: 'process',
            children: (
              <ProcessPane
                initData={{
                  deletable: data.deletable,
                  reducingByRepeatApprover: data.reducingByRepeatApprover,
                  reducingByInitiator: data.reducingByInitiator,
                }}
              />
            ),
          },
          {
            label: '数据展示设置',
            key: 'display',
            children: (
              <DataDisplayPane
                initData={{
                  tagFieldId: data.displayConfig?.tagFieldId,
                }}
              />
            ),
          },
          {
            label: '消息提醒设置',
            key: 'message',
            children: (
              <MessagePane
                initData={{
                  tipFields: data.tipFields,
                }}
              />
            ),
          },
        ]}
      />
    </div>
  );
};

export default React.memo(ExtraConfig);
