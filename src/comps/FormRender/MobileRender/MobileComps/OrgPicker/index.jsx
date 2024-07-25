import React, { useState, useEffect } from 'react';
import { request } from 'umi';
import { Popup, Cell, Toast, NavBar, Checkbox, Tag } from 'react-vant';
import { UserOutlined } from '@ant-design/icons';
import styles from './styles.less';

//数据格式 [{parentId:xxx, children:[]}]

const OrgPicker = ({ value, onChange, multiple, disabled, readOnly }) => {
  const [visible, setVisible] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState([]);

  const [flatTreeData, setFlatTreeData] = useState([]);

  const [renderList, setRenderList] = useState();

  const search = async (id) => {
    //先检查要查的数据是否存在
    const exist = flatTreeData.find((el) => el.parentId === id);
    if (exist) {
      setRenderList(exist);
      return;
    }

    //类型为单位时，查下级单位和该单位下的部门，放一起显示
    const { data: orgList } = await request('./PROD/approval-objects/orgs', {
      params: { parentId: id },
    });

    const result = [...orgList];
    const packed = { parentId: id, children: result };
    setFlatTreeData([...flatTreeData, packed]);
    setRenderList(packed);
    return;
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
      setSelectedOrg([...selectedOrg, { id, name }]);
    } else {
      const after = selectedOrg.filter((el) => el.id !== id);
      setSelectedOrg(after);
    }
  };

  const onSave = () => {
    onChange?.(selectedOrg);
    setVisible(false);
  };

  const renderTitle = () => {
    if (selectedOrg.length === 0) {
      return readOnly ? '' : '请选择单位';
    }

    if (multiple) {
      return (
        <>
          <span className={styles.users}>
            {selectedOrg?.map((u) => u.name).join(', ')}
          </span>
          等{selectedOrg.length}单位
        </>
      );
    } else {
      return selectedOrg[0]?.name;
    }
  };

  const initRootOrg = async () => {
    const { data: orgList } = await request('./PROD/approval-objects/orgs');
    const result = [...orgList];
    const packed = { parentId: '', children: result };
    setFlatTreeData([...flatTreeData, packed]);
    setRenderList(packed);
  };

  useEffect(() => {
    initRootOrg();
  }, []);

  useEffect(() => {
    if (value) {
      setSelectedOrg(value);
    }
  }, [value]);

  return (
    <>
      <Cell
        className={disabled ? styles.disabledCell : styles.cell}
        title={renderTitle()}
        isLink={!disabled && !readOnly}
        clickable={!disabled && !readOnly}
        onClick={() => {
          !disabled && !readOnly && setVisible(true);
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
              已选择 <em className={styles.count}>{selectedOrg.length}</em>
              部门
              {selectedOrg.length > 0 && (
                <a
                  className={styles.backBtn}
                  style={{ marginLeft: 10 }}
                  onClick={() => setSelectedOrg([])}
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
                          setSelectedOrg([{ id: el.id, name: el.name }]);
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    checked={
                      selectedOrg.findIndex((s) => s.id === el.id) !== -1
                    }
                    style={{ marginRight: 10 }}
                  ></Checkbox>
                }
                title={el.name}
                isLink
                value="下级"
                onClick={() => search(el.id)}
              />
            ))}
          </div>
        </div>
      </Popup>
    </>
  );
};

export default OrgPicker;
