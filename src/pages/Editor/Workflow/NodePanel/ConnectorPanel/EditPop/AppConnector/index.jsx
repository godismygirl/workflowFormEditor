import React, { useEffect } from 'react';
import { useRequest } from 'umi';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Form, Input, Button, Space } from 'antd';
import RuleMapSelect from './RuleMapSelect';
import TargetFormSelect from './TargetFormSelect';
import styles from './styles.less';

const AppConnector = ({ data, onSave }) => {
  const [form] = Form.useForm();
  const targetApp = Form.useWatch('appConnector', form);

  const { data: targetData, run } = useRequest(
    { url: './PROD/apps', params: { id: targetApp?.appId } },
    {
      manual: true,
      formatResult: (res) => res?.data?.formModel?.fields,
      onSuccess: (r) => {},
    },
  );

  const save = async () => {
    const formData = await form.validateFields();
    onSave?.(formData);
  };

  useEffect(() => {
    if (targetApp?.appId) {
      run();
    }
  }, [targetApp]);

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  }, [data]);

  return (
    <>
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item
          name="name"
          label="规则名称"
          rules={[{ required: true, message: '规则名称必填' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="触发动作"
          // name="triggerAction"
          // rules={[{ required: true, message: '触发动作必填' }]}
        >
          <div className={styles.actionBox}>
            <div className={styles.title}>生成目的表单并推送数据</div>
            <div>
              自动生成目的表单，并将本表单当前数据推送至目的表单对应数据
            </div>
          </div>
        </Form.Item>
        <Form.Item
          name="appConnector"
          label="目的表单"
          rules={[{ required: true, message: '目的表单必选' }]}
        >
          <TargetFormSelect />
        </Form.Item>
        <Form.List name="mappings" label="选项列表">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <Space
                  key={key}
                  style={{ display: 'flex', marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item {...restField} name={name}>
                    <RuleMapSelect data={targetData} />
                  </Form.Item>

                  <MinusCircleOutlined
                    style={{ fontSize: 16 }}
                    onClick={() => {
                      remove(name);
                    }}
                  />
                </Space>
              ))}
              <div style={{ width: '100%' }}>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  添加同步字段
                </Button>
              </div>
            </>
          )}
        </Form.List>
      </Form>
      <div className={styles.footer}>
        <Button type="primary" onClick={save}>
          保存规则
        </Button>
      </div>
    </>
  );
};

export default React.memo(AppConnector);
