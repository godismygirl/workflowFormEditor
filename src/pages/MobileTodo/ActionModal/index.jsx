import React from 'react';
import { useLocation, useRequest, history } from 'umi';
import { parse } from 'query-string';
import FormRender from '@/comps/FormRender';
import ProcessRender from '@/comps/ProcessRender';
import { Tabs, Form, Notify } from 'react-vant';
import * as ActionButtons from './ActionButtons';
import { ACTION_MAP } from '@/comps/ActionButtons/consts';
import styles from './styles.less';

const MobileActionModal = () => {
  const { search } = useLocation();
  const query = parse(search);
  const [form] = Form.useForm();

  const fromMessage = !!query.fromMessage;

  const { data, run } = useRequest(
    {
      url: './PROD/processes/details',
      params: { id: query.processId },
    },
    {
      manual: true,
      onSuccess: (d) => {
        form.setFieldsValue(d?.formData);
      },
    },
  );

  const { data: actionConfig } = useRequest(
    {
      url: './PROD/tasks/models',
      params: { id: query.taskId },
    },
    {
      onSuccess: (r) => {
        if (r.endTime) {
          history.push({
            pathname: '/mobile-done-detail',
            search: `?processId=${query.processId}&action=no`,
          });
        } else {
          run();
        }
      },
    },
  );

  const onCheckMainForm = () => {
    return new Promise((resovle, reject) => {
      form
        .validateFields()
        .then(() => resovle())
        .catch(() => {
          Notify.show({ type: 'error', message: '请检查表单必填项' });
          reject();
        });
    });
  };

  return (
    <div className={styles.container}>
      <Tabs type="card">
        <Tabs.TabPane key="form" title="表单">
          <FormRender
            mode="MOBILE"
            cols={1}
            layout={data?.formModel?.fields}
            form={form}
            fieldConfigs={actionConfig?.fieldConfigs}
          />
        </Tabs.TabPane>
        <Tabs.TabPane key="process" title="流程">
          <ProcessRender processId={query.processId} />
        </Tabs.TabPane>
      </Tabs>

      {data?.processInstance?.currentNodeId === actionConfig?.nodeId && (
        <div className={styles.footer}>
          <div className={styles.flexRow}>
            {actionConfig?.actions?.map((el, index) => {
              if (el.show) {
                const Comp = ActionButtons[ACTION_MAP[el.action]];

                return (
                  <Comp
                    key={el.actionId}
                    taskId={query.taskId}
                    processId={query.processId}
                    actionData={el}
                    startForm={form}
                    onCheck={onCheckMainForm}
                    onSuccess={() => {
                      if (fromMessage) {
                        run();
                      } else {
                        history.back();
                      }
                    }}
                    signature={actionConfig?.signRequired}
                  />
                );
              }
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(MobileActionModal);
