import React from 'react';
import { useRequest, useLocation } from 'umi';
import { parse } from 'query-string';
import { Select } from 'antd';

const ServiceProvider = ({ style, ...rest }) => {
  const { search } = useLocation();
  const query = parse(search);

  const { data, loading } = useRequest(
    {
      url: './PROD/components/list-items',
      method: 'post',
      data: { appId: query.appId },
    },
    {
      formatResult: (res) =>
        res.data?.map((el) => ({ label: el.name, value: el.id })),
    },
  );

  return (
    <Select
      loading={loading}
      options={data}
      {...rest}
      style={style ?? { width: '100%' }}
    />
  );
};

export default ServiceProvider;
