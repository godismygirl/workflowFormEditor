import React, { useState } from 'react';
import { useRequest, request } from 'umi';
import { TreeSelect } from 'antd';
import styles from './styles.less';

const OrgPicker = ({
  value,
  onChange,
  multiple,
  error,
  disabled,
  readOnly,
  style,
  //autoSelect,
  onload,
}) => {
  const { data: treeData, loading } = useRequest(
    './PROD/approval-objects/orgs/all',
    {
      formatResult: (r) => {
        const formated = r.data.map((el) => ({
          id: el.id,
          pId: el.parentId,
          title: el.name,
          type: el.type,
          value: el.id,
        }));
        return formated;
      },
      // onSuccess: (r) => {
      //   if (autoSelect) {
      //     //自动选中第一个
      //     onChange?.([
      //       {
      //         id: r[0].value,
      //         name: r[0].label,
      //         type: r[0].type,
      //       },
      //     ]);
      //     onload?.();
      //   }
      // },
    },
  );

  const getTreeValue = () => {
    if (multiple) {
      return value?.map((el) => ({ label: el.name, value: el.id }));
    } else {
      return value?.[0] && { label: value?.[0]?.name, value: value?.[0]?.id };
    }
  };

  const onSelectChange = (value, label, extra) => {
    if (readOnly) return;
    let result = null;

    if (!value) {
      onChange();
      return;
    }
    if (multiple) {
      result = value?.map((el) => ({
        id: el.value,
        name: el.label,
        type: 'ORG',
      }));
    } else {
      result = [
        {
          id: value.value,
          name: value.label,
          type: 'ORG',
        },
      ];
    }
    onChange?.(result);
  };

  return (
    <span style={{ pointerEvents: readOnly ? 'none' : 'auto' }}>
      <TreeSelect
        value={getTreeValue()}
        labelInValue
        treeDataSimpleMode
        loading={loading}
        treeData={treeData}
        treeLine
        disabled={disabled}
        error={error}
        multiple={multiple}
        treeCheckable={multiple}
        treeCheckStrictly={multiple}
        showCheckedStrategy={TreeSelect.SHOW_ALL}
        onChange={onSelectChange}
        style={style}
        allowClear
      />
    </span>
  );
};

export default OrgPicker;
