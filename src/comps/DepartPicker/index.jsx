import React, { useState } from 'react';
import { Modal } from 'antd';
import OrgList from '@/comps/EmployeePicker/OrgList';
import DepartList from './DepartList';
import DepartTag from './DepartTag';
import styles from './styles.less';

const DepartPicker = ({
  value,
  onChange,
  multiple,
  placeholder,
  disabled,
  readOnly,
  style,
  ...rest
}) => {
  const error = rest?.['aria-invalid'] === 'true';
  const [open, setOpen] = useState(false);
  const [activeOrgId, setActiveOrgId] = useState();

  const removeSelected = (id) => {
    const after = value?.filter((el) => el.id !== id);
    onChange?.(after?.length > 0 ? after : undefined);
  };

  const renderSelectedTags = () => {
    return (
      <>
        {value.map((el, i) => (
          <DepartTag
            key={i}
            disabled={disabled}
            readOnly={readOnly}
            title={el.name}
            onRemove={() => removeSelected(el.id)}
            style={{ marginRight: 5 }}
          />
        ))}
      </>
    );
  };

  return (
    <>
      <div
        className={error ? styles.errorInput : styles.input}
        style={style}
        onClick={() => {
          !disabled && !readOnly && setOpen(true);
        }}
      >
        {multiple ? (
          <>
            {value?.length > 0 ? (
              renderSelectedTags()
            ) : (
              <span className={styles.placeholder}>
                {placeholder ?? '请选择部门'}
              </span>
            )}
          </>
        ) : (
          <span style={{ paddingLeft: 5 }}>
            {value?.[0]?.name ?? (
              <span className={styles.placeholder} style={{ marginLeft: 0 }}>
                {placeholder ?? '请选择部门'}
              </span>
            )}
          </span>
        )}
      </div>
      <Modal
        open={open}
        width={850}
        title="选择部门"
        footer={null}
        onCancel={() => setOpen(false)}
        afterClose={() => {
          setActiveOrgId();
        }}
        destroyOnClose
      >
        <div className={styles.box}>
          <OrgList
            onChange={(id) => {
              //debugger;
              setActiveOrgId(id);
            }}
          />
          <DepartList
            orgId={activeOrgId}
            multiple={multiple}
            value={value}
            onChange={(v) => {
              onChange?.(v?.length > 0 ? v : undefined);
              setOpen(false);
            }}
          />
        </div>
      </Modal>
    </>
  );
};

export default React.memo(DepartPicker);
