import React from 'react';
import { Radio } from 'antd';
import styles from './styles.less';

const TitleTemplate = () => {
  return (
    <>
      <div className={styles.header}>
        <Radio.Group
          value="DEFAULT_TITLE"
          options={[
            { label: '默认标题', value: 'DEFAULT_TITLE' },
            { label: '自定义标题', value: 'CUSTOM_TITLE', disabled: true },
          ]}
        />
      </div>
      <div className={styles.box}>
        【<span className={styles.tag}>消息类型</span>】
        <span className={styles.tag}>提交人</span>发起的
        <span className={styles.tag}>表单名称</span>
      </div>
    </>
  );
};

export default TitleTemplate;
