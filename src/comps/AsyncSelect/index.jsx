import React from 'react';
import { useRequest } from 'umi';
import { Select } from 'antd';

const AsyncSelect = ({
  remote,
  showAll,
  value,
  onChange,
  refreshDeps,
  placeholder = '请选择',
  onSuccess,
  ...rest
}) => {
  if (!remote) return;
  const { labelField, valueField, filter, ...rest } = remote;

  //let deps = remote.params ? [remote.url, remote.params] : [remote.url];

  const { data, loading } = useRequest(
    { ...rest },
    {
      formatResult: (res) => {
        let result = res?.data;

        if (filter) {
          result = result.filter(filter);
        }

        result = result?.map((el) => ({
          ...el,
          label: labelField ? el[labelField] : el.label,
          value: valueField ? el[valueField] : el.value,
        }));

        if (showAll) {
          result.unshift({
            label: '全部',
            value: '',
          });
        }
        return result;
      },
      onSuccess,
      refreshDeps,
    },
  );
  return (
    <Select
      placeholder={placeholder}
      options={data}
      loading={loading}
      value={value}
      onChange={onChange}
      {...rest}
    />
  );
};

export default React.memo(AsyncSelect);
