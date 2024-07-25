import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import styles from './styles.less';

const RoleTag = ({ title, onRemove, disabled, readOnly, style }) => {
  return (
    <div className={disabled ? styles.disabledTag : styles.tag} style={style}>
      <span className={styles.tagName} title={title}>
        {title}
      </span>
      <i
        className={styles.removeIcon}
        onClick={(e) => {
          if (disabled || readOnly) return;
          e.stopPropagation();
          onRemove?.();
        }}
      >
        <CloseOutlined />
      </i>
    </div>
  );
};

export default RoleTag;
