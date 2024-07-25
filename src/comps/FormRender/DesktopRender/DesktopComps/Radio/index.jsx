import React from 'react';
import { Radio, Select, Space } from 'antd';

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
          {...rest}
        />
      ) : (
        <Radio.Group
          onChange={(v) => {
            if (readOnly) return;
            onChange?.(v);
          }}
          {...rest}
        >
          <Space direction={direction}>
            {options.map((el, index) => {
              return (
                <div key={index}>
                  <Radio value={el.value}>{el.label}</Radio>
                  {/* {el.desc && (
              <div className={styles.descRow}>
                <Input placeholder="备注" />
              </div>
            )} */}
                </div>
              );
            })}
          </Space>
        </Radio.Group>
      )}
    </>
  );
};

export default CustomRadio;
