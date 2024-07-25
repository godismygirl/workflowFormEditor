import React, { useState, useCallback, useMemo } from 'react';
import { Button } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './style.less';

const MapScaler = ({
  val,
  onChange,
  min = 50,
  max = 200,
  step = 10,
  style,
}) => {
  const [scale, setScale] = useState(val || 100);
  const [range, setRange] = useState({
    min: false,
    max: false,
  });

  const onMinus = useCallback(() => {
    let newScale = scale;
    if (scale - step < min) {
      setRange({
        min: true,
        max: false,
      });
      newScale = min;
    } else {
      setRange({
        min: false,
        max: false,
      });
      newScale = scale - step;
    }
    setScale(newScale);
    onChange && onChange(newScale / 100);
  }, [scale]);

  const onPlus = useCallback(() => {
    let newScale = scale;
    if (scale + step > max) {
      setRange({
        min: false,
        max: true,
      });
      newScale = max;
    } else {
      setRange({
        min: false,
        max: false,
      });
      newScale = scale + step;
    }
    setScale(newScale);
    onChange && onChange(newScale / 100);
  }, [scale]);

  return (
    <div className={styles.scale} style={style}>
      <Button icon={<MinusOutlined />} disabled={range.min} onClick={onMinus} />
      <div className={styles.number}>{scale} %</div>
      <Button icon={<PlusOutlined />} disabled={range.max} onClick={onPlus} />
    </div>
  );
};

export default React.memo(MapScaler);
