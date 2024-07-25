import React from 'react';
import { useRequest } from 'umi';
import { Select } from 'antd';

const ServiceSelect = ({ value, onChange, ...rest }) => {
  const { data: options, loading } = useRequest(
    {
      url: './PROD/apps/services',
    },
    {
      formatResult: (res) =>
        res?.data?.map((el) => ({
          label: el.name,
          value: el.id,
        })),
    },
  );

  const onSelectChange = (v, op) => {
    onChange?.({ serviceId: v });
  };

  return (
    <Select
      value={value?.serviceId}
      onChange={onSelectChange}
      loading={loading}
      options={options}
      {...rest}
    />
  );
};

export default ServiceSelect;
