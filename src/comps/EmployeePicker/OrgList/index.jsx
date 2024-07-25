import React, { useState } from 'react';
import { useRequest, request } from 'umi';
import { Tree } from 'antd';
import { transformToTreeFormat } from '@/utils/formatTree';
import styles from './styles.less';

const OrgList = ({ onChange }) => {
  const { data: treeData, loading } = useRequest(
    './PROD/approval-objects/orgs/all',
    {
      formatResult: (r) => {
        const formated = r.data.map((el) => ({
          key: el.id,
          id: el.id,
          pid: el.parentId,
          title: el.name,
          type: el.type,
        }));
        const result = transformToTreeFormat(formated);
        return result;
      },
    },
  );

  return (
    <div className={styles.list}>
      <div className={styles.header}>单位列表</div>
      <div className={styles.body}>
        <Tree
          loading={loading}
          treeData={treeData}
          showLine
          onSelect={([key]) => onChange?.(key)}
        />
      </div>
    </div>
  );
};

export default OrgList;
