import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import EquationTypeSelect from './EquationTypeSelect';
import styles from './styles.less';

const EquationSelect = ({ typeData }) => {
  const { activeCompType, setActiveCompType } = useState();

  useEffect(() => {
    if (typeData) {
      setActiveCompType(typeData?.[0]?.value);
    }
  }, [typeData]);

  return (
    <div className={styles.row}>
      <div>
        <Select
          value={activeCompType}
          options={typeData}
          onChange={(v) => setActiveCompType(v)}
        />
      </div>
      <div>
        <EquationTypeSelect type={activeCompType} />
      </div>
      <div></div>
    </div>
  );
};

export default EquationSelect;
