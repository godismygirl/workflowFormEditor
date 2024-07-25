import React, { useState } from 'react';
import { Modal } from 'antd';
import OrgList from './OrgList';
import DepartList from './DepartList';
import UserList from './UserList';
import UserTag from './UserTag';
import styles from './styles.less';

const EmployeePicker = ({
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
  const [activeDepartId, setActiveDepartId] = useState();

  const removeSelected = (id) => {
    const after = value?.filter((el) => el.id !== id);
    onChange?.(after?.length > 0 ? after : undefined);
  };

  const renderSelectedTags = () => {
    return (
      <>
        {value.map((el) => (
          <UserTag
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
                {placeholder ?? '请选择人员'}
              </span>
            )}
          </>
        ) : (
          <span style={{ paddingLeft: 5 }}>
            {value?.[0]?.name ?? (
              <span className={styles.placeholder} style={{ marginLeft: 0 }}>
                {placeholder ?? '请选择人员'}
              </span>
            )}
          </span>
        )}
      </div>
      <Modal
        open={open}
        width={1100}
        title="选择人员"
        footer={null}
        onCancel={() => setOpen(false)}
      >
        <div className={styles.box}>
          <OrgList onChange={(id) => setActiveOrgId(id)} />
          <DepartList
            orgId={activeOrgId}
            onChange={(id) => setActiveDepartId(id)}
          />
          <UserList
            multiple={multiple}
            departId={activeDepartId}
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

export default React.memo(EmployeePicker);
