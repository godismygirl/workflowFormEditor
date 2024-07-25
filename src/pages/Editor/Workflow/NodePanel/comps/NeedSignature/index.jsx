import React, { useCallback } from 'react';
import { Radio, Row, Col } from 'antd';
import styles from './styles.less';

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

const SignatureType = (props) => {
  const { value, onChange } = props;

  const onValueChange = useCallback(
    (e) => {
      onChange && onChange(e.target.value);
    },
    [value],
  );
  return (
    <div className={styles.section} style={{ marginBottom: 15 }}>
      <div className={styles.sectionHeader}>审批是否需要签名</div>
      <div>
        <Radio.Group
          onChange={onValueChange}
          value={value}
          style={{ width: '100%' }}
        >
          <Row>
            <Col span={12}>
              <Radio value={true}>需要签名</Radio>
            </Col>
            <Col span={12}>
              <Radio value={false}>无需签名</Radio>
            </Col>
          </Row>
        </Radio.Group>
      </div>
    </div>
  );
};

export default React.memo(SignatureType);
