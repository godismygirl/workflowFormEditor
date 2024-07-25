import React, { useEffect, useMemo } from 'react';
import { Form, Input, Switch, Button, Dropdown, message, Modal } from 'antd';
import { CloseOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { useRequest } from 'umi';
import PageSpin from '@/comps/PageSpin';
import RelatedFormConfig from './RelatedFormConfig';
import CodeDesc from './CodeDesc';
import styles from './styles.less';

//[{action:'xxx', hidden: Boolean, name:'xxx'}]

const ButtonConfig = ({ value, onChange }) => {
  const [form] = Form.useForm();

  const { data, loading } = useRequest(
    {
      url: './PROD/common/enums',
      params: {
        className: 'com.menhey.mimp.ap.flow.core.workflow.NodeActionTypeEnum',
      },
    },
    {
      onSuccess: (data) => {
        if (!value?.length > 0) {
          const defaultValue = data?.map((el) => ({
            action: el.code,
            text: el.desc,
            show: el.code !== 'FORWARD',
          }));

          form.setFieldsValue({
            actions: defaultValue,
          });
          onChange?.(defaultValue);
        }
      },
    },
  );

  const defaultAction = useMemo(() => {
    const result = data?.map((el) => ({
      action: el.code,
      text: el.desc,
      show: el.code !== 'FORWARD',
    }));

    return result;
  }, [data]);

  const onActionChange = () => {
    const formData = form.getFieldsValue();
    const result = formData.actions.map((el) => ({
      ...el,
      formModel: { fields: el.formModel },
    }));
    onChange?.(result);
  };

  const addRow = (code) => {
    const formData = form.getFieldsValue();
    const target = data?.find((el) => el.code === code);
    form.setFieldsValue({
      actions: [
        ...formData.actions,
        { action: code, text: target?.desc, show: true },
      ],
    });
    onActionChange();
  };

  const removeRow = (index) => {
    const formData = form.getFieldsValue();
    if (formData.actions?.length === 1) {
      message.error('至少保留一个按钮');
      return;
    }
    formData.actions.splice(index, 1);
    form.setFieldsValue({
      actions: formData.actions,
    });
    onActionChange();
  };

  useEffect(() => {
    form.setFieldsValue({
      actions:
        value?.length > 0
          ? value.map((el) => ({ ...el, formModel: el.formModel?.fields }))
          : defaultAction,
    });
  }, [value]);

  return (
    <div className={styles.container}>
      <PageSpin show={loading} />
      <div className={styles.title}>
        <span>设置操作按钮</span>
        <Dropdown
          menu={{
            items: data?.map((d) => ({
              key: d.code,
              label: <span onClick={() => addRow(d.code)}>{d.desc}</span>,
            })),
          }}
          placement="bottom"
          arrow
        >
          <Button type="primary" ghost size="small">
            增加按钮
          </Button>
        </Dropdown>
      </div>
      <Form form={form} onValuesChange={onActionChange}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: 90 }}>按钮编码</th>
              <th>显示名称</th>
              <th style={{ width: 80 }}>是否显示</th>
              <th style={{ width: 80 }}>操作</th>
              <th style={{ width: 40, textAlign: 'center' }}></th>
            </tr>
          </thead>
          <tbody>
            <Form.List name="actions">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <tr key={index}>
                      <td>
                        {/* {getButtonName(index)} */}
                        <Form.Item name={[field.name, 'action']} noStyle>
                          <CodeDesc descMap={data} />
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item name={[field.name, 'text']}>
                          <Input size="small" />
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item
                          name={[field.name, 'show']}
                          valuePropName="checked"
                        >
                          <Switch
                            size="small"
                            checkedChildren="显示"
                            unCheckedChildren="隐藏"
                          />
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item name={[field.name, 'formModel']}>
                          <RelatedFormConfig />
                        </Form.Item>
                      </td>
                      <td>
                        <i
                          className={styles.deleteBtn}
                          onClick={() => {
                            Modal.confirm({
                              title: '确认删除',
                              icon: <ExclamationCircleFilled />,
                              content: '确定要删除按钮吗？',
                              okText: '确定',
                              okType: 'danger',
                              cancelText: '取消',
                              onOk() {
                                removeRow(index);
                              },
                              onCancel() {},
                            });
                          }}
                        >
                          <CloseOutlined />
                        </i>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </Form.List>
          </tbody>
        </table>
      </Form>
    </div>
  );
};

export default React.memo(ButtonConfig);
