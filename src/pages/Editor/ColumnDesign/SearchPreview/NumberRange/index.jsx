import React, { useState, useEffect } from 'react';
import { InputNumber } from 'antd';
import styles from './styles.less';

const NumberRange = ({ value, onChange }) => {
  const [start, setStart] = useState();
  const [end, setEnd] = useState();

  const onStartChange = (v) => {
    if (v <= end || !end) {
      setStart(v);
      onChange([v, end]);
    } else {
      setStart(end);
    }
  };

  const onEndChange = (v) => {
    if (v >= start || !start) {
      setEnd(v);
      onChange([start, v]);
    } else {
      setEnd(start);
    }
  };

  useEffect(() => {
    if (!value?.length > 0) return;
    setStart(value?.[0]);
    setEnd(value?.[1]);
  }, [value]);

  return (
    <div className={styles.box}>
      <InputNumber value={start} onChange={onStartChange} />
      <span>-</span>
      <InputNumber value={end} onChange={onEndChange} />
    </div>
  );
};

export default NumberRange;
