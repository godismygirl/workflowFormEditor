import React, { useState, useEffect } from 'react';
import { Radio } from 'antd';
import EmployeePicker from '@/comps/EmployeePicker';
import styles from './styles.less';

const ParentApproverSelect = ({ value, onChange, ...rest }) => {
  console.log(rest);
  const [radioVal, setRadioVal] = useState('ALL');

  useEffect(() => {
    setRadioVal(value?.length > 0 ? 'PARTIAL' : 'ALL');
  }, [value]);

  return (
    <div className={styles.container}>
      <Radio.Group
        value={radioVal}
        options={[
          { label: '全部', value: 'ALL' },
          { label: '固定可选范围', value: 'PARTIAL' },
        ]}
        onChange={(e) => {
          const val = e.target.value;
          if (val === 'ALL') {
            onChange?.();
          }
          setRadioVal(val);
        }}
      />
      {radioVal === 'PARTIAL' && (
        <div className={styles.row}>
          <EmployeePicker
            multiple
            value={value}
            onChange={(users) => onChange?.(users)}
          />
        </div>
      )}
    </div>
  );
};

export default ParentApproverSelect;
