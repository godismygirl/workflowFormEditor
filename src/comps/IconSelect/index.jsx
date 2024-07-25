import React, { useState } from 'react';
import { Modal, ColorPicker, Button } from 'antd';
import * as defaultIcons from '@ant-design/icons';
import defaultList from './iconNames';
import styles from './styles.less';

const IconSelect = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [pickedIconName, setPickedIconName] = useState();

  const getIcon = (name) => {
    if (!name) return;
    const Comp = defaultIcons[name];
    return <Comp />;
  };

  const saveIcon = () => {
    setOpen(false);
    onChange?.({
      name: pickedIconName,
      hex: value?.hex,
    });
  };

  return (
    <div className={styles.row}>
      <div>
        {value.name ? (
          <div className={styles.prview} style={{ background: value?.hex }}>
            {getIcon(value?.name)}
          </div>
        ) : (
          <i className={styles.emptyPreview}>
            <defaultIcons.CloseOutlined />
          </i>
        )}
      </div>

      <label className={styles.label}>选择图标</label>
      <div>
        {value?.name ? (
          <div className={styles.pickedIcon} onClick={() => setOpen(true)}>
            {getIcon(value?.name)}
          </div>
        ) : (
          <Button type="primary" ghost onClick={() => setOpen(true)}>
            选择
          </Button>
        )}
      </div>

      <label className={styles.label}>选择背景色</label>
      <div>
        <ColorPicker
          value={value?.hex}
          showText
          format="hex"
          onChange={(_, hex) => {
            onChange?.({
              name: value?.name,
              hex,
            });
          }}
        />
      </div>
      <Modal
        open={open}
        title="选择图标"
        okText="保存"
        cancelText="取消"
        onOk={saveIcon}
        width={900}
        styles={{ body: { padding: 0 } }}
        onCancel={() => {
          setPickedIconName(value?.name);
          setOpen(false);
        }}
      >
        <div className={styles.iconBox}>
          {defaultList?.map((name, index) => (
            <div
              className={
                pickedIconName === name ? styles.activeIcon : styles.icon
              }
              key={index}
              onClick={() => {
                setPickedIconName(name);
              }}
            >
              {getIcon(name)}
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default React.memo(IconSelect);
