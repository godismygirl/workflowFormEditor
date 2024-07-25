import React, { useState, useMemo } from 'react';
import { useModel } from 'umi';
import { Select } from 'antd';
import { COMP_NAMES } from '@/pages/Editor/AuditForm/consts';
import styles from './styles.less';

const getOptions = (arr) => {
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

const RuleMapSelect = ({ value, onChange, data }) => {
  //value : {sourceId,targetId}
  const { layout } = useModel('useFormLayout');

  const targetOptions = useMemo(() => {
    return getOptions(data);
  }, [data]);

  const sourceOptions = useMemo(() => {
    const target = targetOptions?.find((el) => el.value === value?.targetId);
    const pool = getOptions(layout);
    const result = pool?.filter((el) => el.type === target?.type) ?? [];
    return result;
  }, [layout, value, targetOptions]);

  return (
    <div className={styles.row}>
      <span>目的表单字段</span>
      <Select
        options={targetOptions}
        value={value?.targetId}
        onChange={(v) => onChange?.({ targetId: v, sourceId: '' })}
        style={{ width: 170 }}
      />
      <span>同步为</span>
      <Select
        value={value?.sourceId}
        options={sourceOptions}
        onChange={(v) => onChange?.({ ...value, sourceId: v })}
        style={{ width: 170 }}
      />
    </div>
  );
};

export default RuleMapSelect;
