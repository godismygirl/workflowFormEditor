import React from 'react';
import { DatetimePicker, Field } from 'react-vant';
import dayjs from 'dayjs';
import styles from './styles.less';

const VantDatePicker = ({ value, onChange, readOnly, disabled }) => {
  const onDateChange = (val) => {
    const formated = dayjs(val).format('YYYY-MM-DD');
    onChange?.(formated);
  };

  return (
    <DatetimePicker
      popup={{
        round: true,
      }}
      type="date"
      title="选择年月日"
      // minDate={new Date(2021, 0, 1)}
      // maxDate={new Date(2025, 10, 1)}
      value={value}
      onConfirm={onDateChange}
    >
      {(val, _, actions) => {
        return (
          <Field
            readOnly={true}
            disabled={disabled}
            className={styles.pickerField}
            value={val && dayjs(val).format('YYYY-MM-DD')}
            placeholder={readOnly ? '' : '请选择日期'}
            onClick={(e) => {
              e.preventDefault();
              !readOnly && !disabled && actions.open();
            }}
          />
        );
      }}
    </DatetimePicker>
  );
};

export default VantDatePicker;
