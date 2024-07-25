import React, { useMemo } from 'react';
import { useRequest, useLocation } from 'umi';
import { parse } from 'query-string';
import { Select } from 'antd';

const TargetFormSelect = ({ value, onChange, ...rest }) => {
  const { pathname, search } = useLocation();
  const query = parse(search);

  const { data: options, loading } = useRequest(
    {
      url: './PROD/apps/list',
      method: 'POST',
      data: { active: true },
    },
    {
      formatResult: (res) =>
        res?.data
          ?.map((el) => ({
            label: el.name,
            value: el.id,
            version: el.latestVersion,
          }))
          ?.filter((el) => el.value !== query?.appId),
    },
  );

  const onSelectChange = (v, op) => {
    onChange?.({ appId: v, appVersion: op.version });
  };

  return (
    <Select
      loading={loading}
      options={options}
      value={value?.appId}
      onChange={onSelectChange}
      {...rest}
    />
  );
};

export default TargetFormSelect;
