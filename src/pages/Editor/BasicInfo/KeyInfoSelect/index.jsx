import React, { useMemo, useEffect } from 'react';
import { useModel } from 'umi';
import { Switch, Select } from 'antd';
import { CATEGORY, COMP_NAMES } from '@/pages/Editor/AuditForm/consts';
import styles from './styles.less';

const KeyInfoSelect = ({ value, onChange }) => {
  const { layout } = useModel('useFormLayout');

  const keyData = useMemo(() => {
    const result = [];
    layout.map((el) => {
      if (
        (el.category === CATEGORY.INTERACT ||
          el.category === CATEGORY.BUSINESS) &&
        el.type !== COMP_NAMES.IMAGE_PICKER &&
        el.type !== COMP_NAMES.UPLOAD
      ) {
        if (el.attrs.required) {
          result.push({
            label: el.attrs.label,
            value: el.id,
          });
        }
      }
    });
    return result;
  }, [layout]);

  const onSwitchChange = (checked) => {
    if (!checked) {
      onChange?.(undefined);
    } else {
      onChange?.(keyData?.[0]?.value);
    }
  };

  const onSelectChange = (val) => {
    onChange?.(val);
  };

  useEffect(() => {
    if (keyData?.findIndex((el) => el.value === value) === -1) {
      //布局动过，可能删除了些组件
      onChange?.(undefined);
    }
  }, [layout]);

  return (
    <div className={styles.row}>
      <Switch
        checkedChildren="是"
        unCheckedChildren="否"
        checked={!!value}
        onChange={onSwitchChange}
        disabled={keyData?.length === 0}
      />
      {keyData?.length > 0 && value && (
        <Select
          options={keyData}
          value={value}
          style={{ width: 200, marginLeft: 12 }}
          onChange={onSelectChange}
        />
      )}
    </div>
  );
};

export default KeyInfoSelect;
