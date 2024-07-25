import React, { useState } from 'react';
import { request, useModel, useLocation, history } from 'umi';
import { parse } from 'query-string';
import { Space, Button, Modal, Steps, message } from 'antd';
import { TAB_KEY } from '@/pages/Editor';
import styles from './styles.less';

const SaveBtn = () => {
  const titleMap = {
    [TAB_KEY.BASIC]: '基础信息',
    [TAB_KEY.FORM]: '表单设计',
    [TAB_KEY.WORKFLOW]: '流程设计',
    [TAB_KEY.COLUMN]: '列表设计',
    [TAB_KEY.PRINT]: '打印设置',
    [TAB_KEY.CONFIG]: '扩展设置',
  };

  const { open, startSave, endSave, validateStatus, validatePass, result } =
    useModel('useSaveProgress');
  const { clear } = useModel('useAppHeader');
  const { setActiveItem } = useModel('useFormLayout');

  const { search } = useLocation();
  const query = parse(search);
  const [loading, setLoading] = useState(false);

  let items = [];

  Object.keys(validateStatus).map((key) => {
    if (key === TAB_KEY.WORKFLOW || key === TAB_KEY.CONFIG) {
      if (query.hasWorkflow) {
        items.push({
          title: titleMap[key],
          status: validateStatus[key],
        });
      }
    } else {
      items.push({
        title: titleMap[key],
        status: validateStatus[key],
      });
    }
  });

  const save = async () => {
    const refined = {
      id: query?.appId,
      name: result[TAB_KEY.BASIC].name,
      remark: result[TAB_KEY.BASIC].remark,
      props: result[TAB_KEY.BASIC].props,
      type: query.hasWorkflow ? 'FLOW_FORM' : 'FORM',
      configs: {
        printConfig: result[TAB_KEY.PRINT].printConfig,
        approvalObjects: result[TAB_KEY.BASIC].approvalObjects,
      },

      formModel: {
        fields: result[TAB_KEY.FORM],
        searchConfig: result[TAB_KEY.COLUMN],
        displayConfig: { tagFieldId: result[TAB_KEY.CONFIG]?.tagFieldId },
      },

      processModel: {
        nodeModel: result[TAB_KEY.WORKFLOW],
        flowConfig: {
          deletable: result[TAB_KEY.CONFIG]?.deletable,
          reducingByInitiator: result[TAB_KEY.CONFIG]?.reducingByInitiator,
          reducingByRepeatApprover:
            result[TAB_KEY.CONFIG]?.reducingByRepeatApprover,
        },
        noticeConfig: result[TAB_KEY.CONFIG]?.noticeConfig,
      },
    };
    //debugger;

    setLoading(true);
    const res = await request('./PROD/apps', {
      method: query?.appId ? 'PUT' : 'POST',
      data: refined,
    }).catch(() => setLoading(false));
    setLoading(false);

    if (res?.errCode === '0000') {
      message.success('保存成功');
      endSave();
      setActiveItem();
      clear();
      history.replace('/entry');
    }
  };

  return (
    <>
      <Button
        type="primary"
        ghost
        onClick={() => {
          luckysheet?.exitEditMode?.();
          startSave();
        }}
      >
        保存
      </Button>
      <Modal
        title="检查设置项"
        width={800}
        open={open}
        footer={null}
        zIndex={5000}
        onCancel={endSave}
      >
        <div className={styles.header}>
          <Steps labelPlacement="vertical" items={items} />
        </div>
        <div className={styles.footer}>
          {validatePass ? (
            <Button type="primary" onClick={save} loading={loading}>
              保存
            </Button>
          ) : (
            <Button type="primary" onClick={endSave}>
              去修改
            </Button>
          )}
        </div>
      </Modal>
    </>
  );
};

export default React.memo(SaveBtn);
