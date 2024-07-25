import React, { useEffect, useMemo } from 'react';
import { useModel } from 'umi';
import { Form, Select } from 'antd';
import DepartPicker from '@/comps/DepartPicker';
import RolePicker from '@/comps/RolePicker';
import EmployeePicker from '@/comps/EmployeePicker';
import OrgPicker from '@/comps/OrgPicker';
import { COMP_NAMES } from '@/pages/Editor/AuditForm/consts';
import ValueSelect from './Select';
import ValueInput from './Input';
import styles from './styles.less';

const RuleSelect = ({ value, onChange }) => {
  //把三种组件条件加进来，Input TextArea Radio
  const { layout } = useModel('useFormLayout');

  const [form] = Form.useForm();
  const key = Form.useWatch('key', form);

  const addonList = useMemo(() => {
    let result = [];
    layout?.map((el) => {
      if (
        el.attrs.required &&
        (el.type === COMP_NAMES.INPUT ||
          el.type === COMP_NAMES.TEXT_AREA ||
          el.type === COMP_NAMES.RADIO)
      ) {
        result.push({
          label: el.attrs.label,
          value: el.id,
          type: el.type,
          options: el.attrs.options,
        });
      }
    });
    return result;
  }, [layout]);

  const renderValueItem = () => {
    switch (key) {
      case 'BI_INITIATOR':
        return <EmployeePicker multiple />;
      case 'BI_INITIATOR_DEPART':
        return <DepartPicker multiple />;
      case 'BI_INITIATOR_ROLE':
        return <RolePicker />;
      case 'BI_INITIATOR_ORG':
        return <OrgPicker multiple />;

      default: {
        const comp = addonList.find((el) => el.value === key);
        if (!comp) return <></>;

        if (
          comp.type === COMP_NAMES.INPUT ||
          comp.type === COMP_NAMES.TEXT_AREA
        ) {
          return <ValueInput />;
        }

        if (comp.type === COMP_NAMES.RADIO) {
          return <ValueSelect options={comp.options} />;
        }
      }
    }
  };

  const onValuesChange = (_, formData) => {
    onChange?.(formData);
  };

  useEffect(() => {
    if (value) {
      form.setFieldsValue(value);
    } else {
      form.setFieldsValue({
        key: 'BI_INITIATOR',
        equationType: 'IN',
        value: undefined,
      });
    }
  }, [value]);

  return (
    <Form form={form} onValuesChange={onValuesChange}>
      <div className={styles.row}>
        <div className={styles.initCol}>
          <Form.Item name="key" rules={[{ required: true, message: '必选' }]}>
            <Select
              options={[
                { label: '发起人', value: 'BI_INITIATOR' },
                { label: '发起人部门', value: 'BI_INITIATOR_DEPART' },
                { label: '发起人角色', value: 'BI_INITIATOR_ROLE' },
                { label: '发起人单位', value: 'BI_INITIATOR_ORG' },
                ...addonList.map((el) => ({
                  label: el.label,
                  value: el.value,
                })),
              ]}
              onChange={() => form.setFieldsValue({ value: undefined })}
            />
          </Form.Item>
        </div>
        <div className={styles.equationCol}>
          <Form.Item
            name="equationType"
            rules={[{ required: true, message: '必选' }]}
          >
            <Select
              options={[
                { label: '等于任意一个', value: 'IN' },
                { label: '不等于任意一个', value: 'NOT_IN' },
              ]}
            />
          </Form.Item>
        </div>
        <div className={styles.valueCol}>
          <Form.Item name="value" rules={[{ required: true, message: '必选' }]}>
            {renderValueItem()}
          </Form.Item>
        </div>
      </div>
    </Form>
  );
};

export default RuleSelect;
