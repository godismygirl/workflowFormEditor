import React, { useCallback } from 'react';
import { Radio, Row, Col } from 'antd';
import style from './style.less';

const AuditType = ({ value, onChange }) => {
  return (
    <div className={style.section} style={{ marginBottom: 15 }}>
      <div className={style.sectionHeader}>多人审批方式</div>
      <div>
        <Radio.Group
          onChange={onChange}
          value={value}
          style={{ width: '100%' }}
        >
          <div className={style.row}>
            <Radio value="ALL">
              会签 <span className={style.desc}>（需所有审批人同意）</span>
            </Radio>
          </div>
          <div className={style.row}>
            <Radio value="ANY_ONE">
              或签
              <span className={style.desc}>（一名审批人同意或拒绝即可）</span>
            </Radio>
          </div>
        </Radio.Group>
      </div>
    </div>
  );
};

export default React.memo(AuditType);
