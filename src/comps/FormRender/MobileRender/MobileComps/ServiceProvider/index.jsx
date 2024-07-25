import React, { useState } from 'react';
import { useRequest, useLocation } from 'umi';
import { parse } from 'query-string';
import { Picker, Field } from 'react-vant';
import styles from './styles.less';

const ServiceProvider = ({ value, onChange, readOnly }) => {
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
        res.data?.map((el) => ({ text: el.name, value: el.id })),
    },
  );

  return (
    <Picker
      popup={{
        round: true,
      }}
      loading={loading}
      value={value}
      title="标题"
      columns={data ?? []}
      onConfirm={(v) => {
        !readOnly && onChange?.(v);
      }}
    >
      {(val, op, actions) => {
        return (
          <Field
            readOnly
            clickable
            //label='选择服务方'
            className={styles.inner}
            value={op?.text || ''}
            placeholder="请选择服务方"
            onClick={() => actions.open()}
          />
        );
      }}
    </Picker>
  );
};

export default ServiceProvider;
