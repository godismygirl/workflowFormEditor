import React, { useState, useEffect } from 'react';
import { request } from 'umi';
import { Tree, Button, Space } from 'antd';
import PageSpin from '@/comps/PageSpin';
import RoleTag from '../RoleTag';
import { transformToTreeFormat } from '@/utils/formatTree';
import styles from './styles.less';

const RoleList = ({ orgId, value, onChange }) => {
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState([]);
  const [selected, setSelected] = useState([]);

  const fetchDeparts = async () => {
    setLoading(false);
    const res = await request('./PROD/approval-objects/roles/all', {
      params: { orgId },
    }).catch(() => setLoading(true));
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

  const removeSelected = (v) => {
    const after = selected.filter((el) => el.id !== v);
    setSelected(after);
  };

  const getCheckedKeys = () => {
    return selected?.map((el) => el.id);
  };

  const onCheckNode = (_, { checked, checkedNodes, node }) => {
    let after = [...selected];
    if (checked) {
      after.push({ name: node.title, id: node.key });
    } else {
      after = selected.filter((el) => el.id !== node.key);
    }
    setSelected(after);
  };

  const onSelectNode = (keys, { selected, selectedNodes, node }) => {
    if (selected) {
      setSelected([{ name: node.title, id: node.key }]);
    }
  };

  useEffect(() => {
    if (orgId) fetchDeparts();
  }, [orgId]);

  useEffect(() => {
    if (value?.length > 0) {
      setSelected(value);
    } else {
      setSelected([]);
    }
  }, [value]);

  return (
    <>
      <div className={styles.list}>
        <div className={styles.header}>角色列表</div>
        <div className={styles.body}>
          <PageSpin show={loading} />
          <Tree
            showLine
            treeData={treeData}
            checkStrictly
            checkable
            checkedKeys={getCheckedKeys()}
            onCheck={onCheckNode}
            selectedKeys={[selected?.[0]?.id]}
            onSelect={onSelectNode}
          />
        </div>
      </div>
      <div className={styles.pickedList}>
        <div className={styles.header}>
          <span className={styles.title}>已选择</span>
          <span className={styles.total}>
            <a className={styles.count}>{selected?.length}</a>个
          </span>
        </div>
        <div className={styles.body}>
          {selected?.map((p) => (
            <RoleTag
              title={p.name}
              onRemove={() => removeSelected(p.id)}
              style={{ marginBottom: 5 }}
            />
          ))}
        </div>
      </div>
      <div className={styles.footer}>
        <Space>
          <Button onClick={() => setSelected([])}>清空</Button>
          <Button type="primary" onClick={() => onChange?.(selected)}>
            确定
          </Button>
        </Space>
      </div>
    </>
  );
};

export default RoleList;
