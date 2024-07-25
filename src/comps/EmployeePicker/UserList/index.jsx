import { useState, useEffect } from 'react';
import { useRequest } from 'umi';
import { Checkbox, Radio, Space, Button, Empty } from 'antd';
import PageSpin from '@/comps/PageSpin';
import UserTag from '../UserTag';
import styles from './styles.less';

const UserList = ({ departId, multiple, value, onChange }) => {
  const [selected, setSelected] = useState([]);

  const { data, run, loading } = useRequest(
    {
      url: './PROD/approval-objects/users',
      params: { departId },
    },
    {
      manual: true,
    },
  );

  const removeSelected = (v) => {
    const after = selected.filter((key) => key !== v);
    setSelected(after);
  };

  const renderSelectedPersons = () => {
    const persons = selected?.map((el) => {
      const [id, name] = el.split('-');
      return { id, name };
    });

    return (
      <>
        {persons?.map((p) => (
          <UserTag
            title={p?.name}
            onRemove={() => removeSelected(`${p.id}-${p.name}`)}
            style={{ marginBottom: 5 }}
          />
        ))}
      </>
    );
  };

  const onMultiSelect = (arr) => {
    const currentPersonList = data?.map((p) => `${p.id}-${p.name}`);
    //先去掉当前list里的选项
    const rest = selected.filter((item) => !currentPersonList.includes(item));

    //再取并集
    const result = Array.from(new Set(arr.concat(rest)));
    setSelected(result);
  };

  const save = () => {
    const persons = selected?.map((el) => {
      const [id, name] = el.split('-');
      return { id, name };
    });
    onChange?.(persons?.length > 0 ? persons : undefined);
  };

  useEffect(() => {
    if (departId) run();
  }, [departId]);

  useEffect(() => {
    if (value) {
      const result = value.map((el) => `${el.id}-${el.name}`);
      setSelected(result);
    } else {
      setSelected([]);
    }
  }, [value]);

  return (
    <>
      <div className={styles.list}>
        <div className={styles.header}>人员列表</div>
        <div className={styles.body}>
          <PageSpin show={loading} />
          {data?.length === 0 && (
            <div className={styles.empty}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="该部门下暂无人员"
              />
            </div>
          )}
          {multiple ? (
            <Checkbox.Group
              style={{ width: '100%' }}
              value={selected}
              onChange={(v) => onMultiSelect(v)}
            >
              {data?.map((el) => (
                <div className={styles.item} key={el.id}>
                  <Checkbox value={`${el.id}-${el.name}`}></Checkbox>
                  <span className={styles.name}>{el.name}</span>
                </div>
              ))}
            </Checkbox.Group>
          ) : (
            <Radio.Group
              value={selected?.[0]}
              onChange={(e) => setSelected([e.target.value])}
              style={{ width: '100%' }}
            >
              {data?.map((el) => (
                <div className={styles.item} key={el.id}>
                  <Radio value={`${el.id}-${el.name}`}></Radio>
                  <span className={styles.name}>{el.name}</span>
                </div>
              ))}
            </Radio.Group>
          )}
        </div>
      </div>

      {multiple && (
        <div className={styles.pickedList}>
          <div className={styles.header}>
            <span className={styles.title}>已选择</span>
            <span className={styles.total}>
              <a className={styles.count}>{selected?.length}</a>人
            </span>
          </div>
          <div className={styles.body}>{renderSelectedPersons()}</div>
        </div>
      )}

      <div className={styles.footer}>
        <Space>
          <Button onClick={() => setSelected([])}>清空</Button>
          <Button type="primary" onClick={save}>
            确定
          </Button>
        </Space>
      </div>
    </>
  );
};

export default UserList;
