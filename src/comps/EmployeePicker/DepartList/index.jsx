import React, { useState, useEffect } from 'react';
import { useRequest, request } from 'umi';
import { Tree } from 'antd';
import PageSpin from '@/comps/PageSpin';
import { transformToTreeFormat } from '@/utils/formatTree';
import styles from './styles.less';

const DepartList = ({ orgId, onChange }) => {
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDeparts = async () => {
    setLoading(true);
    const res = await request('./PROD/approval-objects/departs/all', {
      params: { orgId },
    }).catch(() => setLoading(false));

    setLoading(false);

    const formated = res.data.map((el) => ({
      key: el.id,
      id: el.id,
      pid: el.parentId,
      title: el.name,
      type: el.type,
    }));

    const result = transformToTreeFormat(formated);
    setTreeData(result);
  };

  useEffect(() => {
    if (orgId) fetchDeparts();
  }, [orgId]);

  return (
    <div className={styles.list}>
      <div className={styles.header}>部门列表</div>
      <div className={styles.body}>
        <PageSpin show={loading} />
        <Tree
          treeData={treeData}
          showLine
          onSelect={([key]) => onChange?.(key)}
        />
      </div>
    </div>
  );
};

export default DepartList;
