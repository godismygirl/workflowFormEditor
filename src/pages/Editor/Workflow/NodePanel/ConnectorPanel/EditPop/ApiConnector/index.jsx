import React, { useEffect } from 'react';
import { useRequest } from 'umi';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Form, Input, Button, Space } from 'antd';
import ServiceSelect from './ServiceSelect';
import ApiMapSelect from './ApiMapSelect';
import styles from './styles.less';

const AppConnector = ({ data, onSave }) => {
  const [form] = Form.useForm();
  const targetApi = Form.useWatch('apiConnector', form);

  const { data: apiSchema, run } = useRequest(
    {
      url: './PROD/apps/services/detail',
      params: { id: targetApi?.serviceId },
    },
    {
      manual: true,
      formatResult: (res) => res?.data?.schema?.apiSchema,
      onSuccess: (r) => {},
    },
  );

  const save = async () => {
    const formData = await form.validateFields();

    const reqArr =
      formData.requestMappings
        ?.filter((el) => el?.targetId && el?.sourceId)
        ?.map((el) => ({ ...el, type: 'REQ' })) ?? [];
    const resArr =
      formData.responseMappings
        ?.filter((el) => el.targetId && el.sourceId)
        ?.map((el) => ({ ...el, type: 'RSP' })) ?? [];

    onSave?.({
      name: formData.name,
      apiConnector: formData.apiConnector,
      mappings: [...reqArr, ...resArr],
    });
  };

  useEffect(() => {
    if (targetApi?.serviceId) {
      run();
    }
  }, [targetApi]);

  useEffect(() => {
    if (data) {
      let reqArr = [];
      let resArr = [];
      data.mappings?.map((el) => {
        if (el.type === 'REQ') {
          reqArr.push(el);
        } else {
          resArr.push(el);
        }
      });
      form.setFieldsValue({
        name: data.name,
        apiConnector: data.apiConnector,
        requestMappings: reqArr,
        responseMappings: resArr,
      });
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
          name="apiConnector"
          label="目标服务"
          rules={[{ required: true, message: '目标服务必选' }]}
        >
          <ServiceSelect />
        </Form.Item>
        <div className={styles.blockTitle}>服务请求映射</div>
        <Form.List name="requestMappings" label="请求选项列表">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <Space
                  key={key}
                  style={{ display: 'flex', marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item {...restField} name={name}>
                    <ApiMapSelect type="REQ" apiSchema={apiSchema} />
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
                  type="primary"
                  ghost
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
        <div className={styles.blockTitle}>服务返回映射</div>
        <Form.List name="responseMappings" label="回应选项列表">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <Space
                  key={key}
                  style={{ display: 'flex', marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item {...restField} name={name}>
                    <ApiMapSelect type="RES" apiSchema={apiSchema} />
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
                  type="primary"
                  ghost
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
