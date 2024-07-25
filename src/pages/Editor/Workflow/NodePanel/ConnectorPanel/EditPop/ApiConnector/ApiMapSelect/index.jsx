import React, { useState, useMemo } from 'react';
import { useModel } from 'umi';
import { Select } from 'antd';
import { COMP_NAMES } from '@/pages/Editor/AuditForm/consts';
import styles from './styles.less';

const getFormOptions = (arr) => {
  const result = [];
  arr?.map((el) => {
    if (el.type === COMP_NAMES.SECTION) {
      el.children?.map((c) => {
        result.push({ label: c.attrs?.label, value: c.id, type: el.type });
      });
    } else {
      if (el.type !== COMP_NAMES.GROUP) {
        result.push({ label: el.attrs?.label, value: el.id, type: el.type });
      }
    }
  });
  return result;
};

const getSchemaOptions = (apiSchema, apiType) => {
  let result = [];
  const arr = apiType === 'REQ' ? apiSchema?.requests : apiSchema?.responses;
  result = arr?.map((el) => ({
    label: el.attrs?.label,
    value: el.id,
    type: el.type,
  }));

  return result;
};

const RuleMapSelect = ({ value, onChange, type, apiSchema }) => {
  //value : {sourceId,targetId}
  //type: REQ RES
  const { layout } = useModel('useFormLayout');

  //   const targetOptions = useMemo(() => {
  //     return getOptions(data);
  //   }, [data]);

  const formOptions = useMemo(() => {
    return getFormOptions(layout);
  }, [layout]);

  const options = useMemo(() => {
    return getSchemaOptions(apiSchema, type);
  }, [apiSchema, type]);

  const targetOptions = useMemo(() => {
    const target = formOptions?.find((el) => el.value === value?.sourceId);

    const result = options?.filter((el) => el.type === target?.type) ?? [];
    return result;
  }, [value, options]);

  return (
    <div className={styles.row}>
      <span>表单字段</span>
      <Select
        options={formOptions}
        value={value?.sourceId}
        onChange={(v, op) => onChange?.({ ...value, sourceId: v })}
        style={{ width: 170 }}
      />
      <span>绑定api</span>
      <Select
        value={value?.targetId}
        options={targetOptions}
        onChange={(v) => onChange?.({ ...value, targetId: v })}
        style={{ width: 170 }}
      />
    </div>
  );
};

export default RuleMapSelect;
