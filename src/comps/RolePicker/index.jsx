import React, { useState } from 'react';
import { Modal } from 'antd';
import OrgList from '@/comps/EmployeePicker/OrgList';
import RoleList from './RoleList';
import RoleTag from './RoleTag';
import styles from './styles.less';

const RolePicker = ({
  value,
  onChange,
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
          <RoleTag
            key={i}
            disabled={disabled}
            readOnly={readOnly}
            //removeable={multiple}
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
        {value?.length > 0 ? (
          renderSelectedTags()
        ) : (
          <span className={styles.placeholder}>
            {placeholder ?? '请选择角色'}
          </span>
        )}
      </div>
      <Modal
        open={open}
        width={850}
        title="选择部门"
        footer={null}
        onCancel={() => setOpen(false)}
      >
        <div className={styles.box}>
          <OrgList onChange={(id) => setActiveOrgId(id)} />
          <RoleList
            orgId={activeOrgId}
            value={value}
            onChange={(v) => {
              onChange?.(v);
              setOpen(false);
            }}
          />
        </div>
      </Modal>
    </>
  );
};

export default React.memo(RolePicker);
