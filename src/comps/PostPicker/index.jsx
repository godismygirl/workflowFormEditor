import React, { useState } from 'react';
import { Modal } from 'antd';
import OrgList from '@/comps/EmployeePicker/OrgList';
import PostList from './PostList';
import PostTag from './PostTag';
import styles from './styles.less';

const PostPicker = ({
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
          <PostTag
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
        {multiple ? (
          <>
            {value?.length > 0 ? (
              renderSelectedTags()
            ) : (
              <span className={styles.placeholder}>
                {placeholder ?? '请选择岗位'}
              </span>
            )}
          </>
        ) : (
          <span style={{ paddingLeft: 5 }}>
            {value?.[0]?.name ?? (
              <span className={styles.placeholder} style={{ marginLeft: 0 }}>
                {placeholder ?? '请选择岗位'}
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
      >
        <div className={styles.box}>
          <OrgList onChange={(id) => setActiveOrgId(id)} />
          <PostList
            orgId={activeOrgId}
            multiple={multiple}
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

export default React.memo(PostPicker);
