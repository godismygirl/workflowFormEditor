import React from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/zh_CN';

const RangePicker = ({ value, onChange, showTime, ...rest }) => {
  const onDateChange = ([start, end]) => {
    const st = dayjs(start).format(
      showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD',
    );
    const ed = dayjs(end).format(
      showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD',
    );
    onChange([st, ed]);
  };

  const getFormatedValue = (val) => {
    if (!val?.length > 0) return;
    return [dayjs(val[0]), dayjs(val[1])];
  };

  const placeText = showTime
    ? ['开始时间', '结束时间']
    : ['开始日期', '结束日期'];

  return (
    <DatePicker.RangePicker
      value={getFormatedValue(value)}
      onChange={onDateChange}
      showTime={showTime}
      locale={locale}
      {...rest}
      placeholder={placeText}
    />
  );
};

export default RangePicker;
