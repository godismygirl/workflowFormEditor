import React from 'react';
import { Select } from 'antd';
import { Radio } from 'react-vant';

const CustomRadio = ({ options, direction, readOnly, onChange, ...rest }) => {
  return (
    <>
      {direction === 'dropdown' ? (
        <Select
          options={options}
          onChange={(v) => {
            if (readOnly) return;
            onChange?.(v);
          }}
          style={{ width: '100%' }}
          {...rest}
        />
      ) : (
        <Radio.Group
          direction={direction}
          onChange={(v) => {
            if (readOnly) return;
            onChange?.(v);
          }}
          {...rest}
        >
          {options?.map((el, i) => (
            <Radio key={i} name={el.value}>
              {el.label}
            </Radio>
          ))}
        </Radio.Group>
      )}
    </>
  );
};

export default CustomRadio;
