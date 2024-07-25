import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import styles from './styles.less';

const UserTag = ({ title, onRemove, style, readOnly, disabled }) => {
  return (
    <div className={disabled ? styles.disabledTag : styles.tag} style={style}>
      <span className={styles.tagName} title={title}>
        {title}
      </span>
      <i
        className={styles.removeIcon}
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled && !readOnly) {
            onRemove?.();
          }
        }}
      >
        <CloseOutlined />
      </i>
    </div>
  );
};

export default UserTag;
