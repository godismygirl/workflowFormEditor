import React, { useEffect, useMemo } from 'react';
import { useRequest, useModel } from 'umi';
import { Form, Radio } from 'antd';
import styles from './styles.less';
import { COMP_NAMES } from '@/pages/Editor/AuditForm/consts';

const PropSettings = ({ nodeId, config, startNode }) => {
  const [form] = Form.useForm();
  const { layout } = useModel('useFormLayout');
  const { updateProcessNode } = useModel('useWorkflow');

  const getDefaultSettings = (data) => {
    const getUIcompName = (type) => {
      switch (type) {
        case 'TITLE':
          return '页面标题';
        case 'TEXT':
          return '文字段落';
        case 'DIVIDER':
          return '分割线';
        default:
      }
    };

    let result = [];

    data.map((el) => {
      if (el.category === 'UI') {
        result.push({
          label: getUIcompName(el.type),
          fieldId: el.id,
          category: el.category,
          fieldBehavior: 'READONLY',
        });
      } else {
        if (el.type === COMP_NAMES.SECTION) {
          el.children?.map((c) => {
            result.push({
              label: c.attrs.label,
              fieldId: c.id,
              category: c.category,
              fieldBehavior: startNode ? 'NORMAL' : 'READONLY',
            });
          });
        } else {
          result.push({
            label: el.attrs.label,
            fieldId: el.id,
            category: el.category,
            fieldBehavior: startNode ? 'NORMAL' : 'READONLY',
          });
        }
      }
    });

    return result;
  };

  const { data: propEnum } = useRequest(
    {
      url: './PROD/common/enums',
      params: {
        className: 'com.menhey.mimp.ap.flow.core.workflow.FieldBehaviorEnum',
      },
    },
    {
      formatResult: (res) =>
        res.data.map((el) => ({ label: el.desc, value: el.code })),
    },
  );

  const existComplist = useMemo(() => getDefaultSettings(layout), [layout]);

  const getOptions = (i) => {
    if (!propEnum) return;
    let opts = propEnum;
    if (existComplist[i].category === 'UI') {
      opts = propEnum.filter((el) => el.value !== 'NORMAL');
    }
    return opts;
  };

  const save = (_, formData) => {
    updateProcessNode(nodeId, {
      fieldConfigs: formData.fieldConfigs,
    });
  };

  const getFieldBehavior = (fieldId) => {
    const target = config?.find((n) => n.fieldId === fieldId);
    return target?.fieldBehavior;
  };

  useEffect(() => {
    if (nodeId) {
      const st = getDefaultSettings(layout);
      const fomated = st.map((el) => ({
        fieldId: el.fieldId,
        fieldBehavior: getFieldBehavior(el.fieldId) ?? el?.fieldBehavior,
      }));
      form.setFieldsValue({ fieldConfigs: fomated });
    }
  }, [nodeId]);

  return (
    <div className={styles.container}>
      <Form
        form={form}
        onValuesChange={save}
        initialValues={{ fieldConfigs: config }}
      >
        <Form.List name="fieldConfigs">
          {(fields) => (
            <>
              {fields.map((field, index) => (
                <div className={styles.row} key={index}>
                  <div className={styles.label}>
                    {existComplist?.[index]?.label}
                  </div>
                  <div className={styles.content}>
                    <Form.Item name={[field.name, 'fieldBehavior']}>
                      <Radio.Group
                        size="small"
                        options={getOptions(index)}
                        optionType="button"
                        buttonStyle="solid"
                      />
                    </Form.Item>
                  </div>
                </div>
              ))}
            </>
          )}
        </Form.List>
      </Form>
    </div>
  );
};

export default PropSettings;
