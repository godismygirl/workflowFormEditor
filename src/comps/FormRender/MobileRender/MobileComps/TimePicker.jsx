import React from 'react';
import { DatetimePicker, Field } from 'react-vant';
import dayjs from 'dayjs';
import styles from './styles.less';

const VantDatePicker = ({ value, onChange, readOnly, disabled }) => {
  const onDateChange = (val) => {
    const formated = dayjs(val).format('YYYY-MM-DD HH:mm:ss');
    onChange?.(formated);
  };

  return (
    <DatetimePicker
      popup={{
        round: true,
      }}
      type="datetime"
      title="选择时间"
      // minDate={new Date(2021, 0, 1)}
      // maxDate={new Date(2025, 10, 1)}
      value={value}
      onConfirm={onDateChange}
    >
      {(val, _, actions) => {
        return (
          <Field
            clickable={!readOnly && !disabled}
            className={styles.pickerField}
            disabled={disabled}
            readOnly={readOnly}
            value={val && dayjs(val).format('YYYY-MM-DD HH:mm:ss')}
            placeholder={readOnly ? '' : '请选择时间'}
            onClick={() => {
              !disabled && !readOnly && actions.open();
            }}
          />
        );
      }}
    </DatetimePicker>
  );
};

export default VantDatePicker;
