import React, { useState, useEffect } from 'react';
import { request } from 'umi';
import { Popup, Cell, Toast, NavBar, Checkbox, Tag } from 'react-vant';
import { UserOutlined } from '@ant-design/icons';
import styles from './styles.less';

//数据格式 [{parentId:xxx, children:[]}]

const PosttPicker = ({ value, onChange, multiple, disabled, readOnly }) => {
  const [visible, setVisible] = useState(false);
  const [selectedDepart, setSelectedDepart] = useState([]);

  const [flatTreeData, setFlatTreeData] = useState([]);

  const [renderList, setRenderList] = useState();

  const search = async (id, type, orgId) => {
    //先检查要查的数据是否存在
    const exist = flatTreeData.find((el) => el.parentId === id);
    if (exist) {
      setRenderList(exist);
      return;
    }

    if (type === 'ORG') {
      //类型为单位时，查下级单位和该单位下的部门，放一起显示
      const { data: orgList } = await request('./PROD/approval-objects/orgs', {
        params: { parentId: id },
      });

      const { data: departList } = await request(
        './PROD/approval-objects/posts/all',
        {
          params: {
            orgId: id,
          },
        },
      );

      const result = [...orgList];
      const dl = departList.map((el) => ({ ...el, orgId: id }));
      const after = result.concat(dl);
      const packed = { parentId: id, children: after };
      setFlatTreeData([...flatTreeData, packed]);
      setRenderList(packed);
      return;
    }
  };

  const backward = () => {
    const target = flatTreeData.find((el) => {
      const index = el.children.findIndex((c) => c.id === renderList.parentId);
      return index !== -1;
    });

    setRenderList(target);
  };

  const onCheckChange = ({ checked, id, name }) => {
    if (checked) {
      setSelectedDepart([...selectedDepart, { id, name }]);
    } else {
      const after = selectedDepart.filter((el) => el.id !== id);
      setSelectedDepart(after);
    }
  };

  const onSave = () => {
    onChange?.(selectedDepart);
    setVisible(false);
  };

  const renderTitle = () => {
    if (selectedDepart.length === 0) {
      return readOnly ? '' : '请选择部门';
    }

    if (multiple) {
      return (
        <>
          <span className={styles.users}>
            {selectedDepart?.map((u) => u.name).join(', ')}
          </span>
          等{selectedDepart.length}部门
        </>
      );
    } else {
      return selectedDepart[0]?.name;
    }
  };

  const initRootOrg = async () => {
    const { data: orgList } = await request('./PROD/approval-objects/orgs');
    const result = [...orgList];
    const packed = { parentId: '', children: result };
    setFlatTreeData([...flatTreeData, packed]);
    setRenderList(packed);
  };

  const renderNodeType = (type) => {
    switch (type) {
      case 'ORG':
        return <Tag color="#1677ff">单位</Tag>;
      case 'DEPART':
        return <Tag color="#e67e22">部门</Tag>;

      default:
    }
  };

  useEffect(() => {
    initRootOrg();
  }, []);

  useEffect(() => {
    if (value) {
      setSelectedDepart(value);
    }
  }, [value]);

  return (
    <>
      <Cell
        className={disabled ? styles.disabledCell : styles.cell}
        title={renderTitle()}
        isLink={!disabled && !readOnly}
        onClick={() => {
          if (!disabled && !readOnly) setVisible(true);
        }}
      />
      <Popup
        visible={visible}
        position="left"
        style={{ width: '100%', height: '100%' }}
        onClose={() => setVisible(false)}
      >
        <div className={styles.container}>
          <NavBar
            className={styles.nav}
            title="请选择"
            leftArrow={<></>}
            leftText="取消"
            rightText="确定"
            onClickLeft={() => setVisible(false)}
            onClickRight={onSave}
          />
          <div className={styles.summary}>
            <span className={styles.chosen}>
              已选择 <em className={styles.count}>{selectedDepart.length}</em>
              部门
              {selectedDepart.length > 0 && (
                <a
                  className={styles.backBtn}
                  style={{ marginLeft: 10 }}
                  onClick={() => setSelectedDepart([])}
                >
                  清空
                </a>
              )}
            </span>
            {renderList?.parentId && (
              <a className={styles.backBtn} onClick={backward}>
                返回
              </a>
            )}
          </div>
          <div className={styles.content}>
            {renderList?.children?.map((el) => (
              <Cell
                key={el.id}
                icon={
                  el.type === 'DEPART' ? (
                    <>
                      <Checkbox
                        shape={multiple ? 'square' : 'round'}
                        onChange={(checked) => {
                          if (multiple) {
                            onCheckChange({
                              checked,
                              id: el.id,
                              name: el.name,
                            });
                          } else {
                            checked &&
                              setSelectedDepart([{ id: el.id, name: el.name }]);
                          }
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        checked={
                          selectedDepart.findIndex((s) => s.id === el.id) !== -1
                        }
                        style={{ marginRight: 10 }}
                      ></Checkbox>
                      <span style={{ marginRight: 10 }}>
                        {renderNodeType(el.type)}
                      </span>
                    </>
                  ) : (
                    <span>{renderNodeType(el.type)}</span>
                  )
                }
                title={el.name}
                isLink
                value="下级"
                onClick={() => search(el.id, el.type)}
              />
            ))}
          </div>
        </div>
      </Popup>
    </>
  );
};

export default PosttPicker;
