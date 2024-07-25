import React, { useState } from 'react';
import { useRequest, request } from 'umi';
import { Tree } from 'antd';
import styles from './styles.less';

const updateTreeData = (list, key, children) =>
  list.map((node) => {
    if (node.key === key) {
      return {
        ...node,
        children,
      };
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children),
      };
    }
    return node;
  });

const OrgList = ({ onChange }) => {
  const [treeData, setTreeData] = useState([]);

  useRequest('./PROD/approval-objects/orgs', {
    formatResult: (r) => r.data.map((el) => ({ title: el.name, key: el.id })),
    onSuccess: (d) => setTreeData(d ?? []),
  });

  const onLoadData = ({ key, children }) =>
    new Promise((resolve) => {
      if (children) {
        resolve();
        return;
      }

      request('./PROD/approval-objects/orgs', {
        params: { parentId: key },
      }).then((res) => {
        setTreeData((origin) =>
          updateTreeData(
            origin,
            key,
            res.data.map((el) => ({ title: el.name, key: el.id })),
          ),
        );
        resolve();
      });
    });

  return (
    <div className={styles.list}>
      <div className={styles.header}>单位列表</div>
      <div className={styles.body}>
        <Tree
          loadData={onLoadData}
          treeData={treeData}
          showLine
          onSelect={([key]) => onChange?.(key)}
        />
      </div>
    </div>
  );
};

export default OrgList;
