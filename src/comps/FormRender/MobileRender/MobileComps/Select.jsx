import React from 'react';
import { Picker } from 'antd-mobile';
import dayjs from 'dayjs';

const Select = ({ options, ...rest }) => {
  return (
    <Picker
      columns={[options]}
      {...rest}
      // visible={visible}
      // onClose={() => {
      //   setVisible(false);
      // }}
      // value={value}
      // onConfirm={(v) => {
      //   setValue(v);
      // }}
    >
      {(value) => (value ? value : '请选择')}
    </Picker>
  );
};

export default Select;
