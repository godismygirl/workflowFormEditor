import React, { useState, useEffect, useMemo } from 'react';
import FormRender from '@/comps/FormRender';
import EmployeePicker from '@/comps/FormRender/MobileRender/MobileComps/EmployeePicker';
import DepartPicker from '@/comps/FormRender/MobileRender/MobileComps/DepartPicker';
import styles from './styles.less';

const MobilePreview = () => {
  const [layout, setLayout] = useState([]);
  useEffect(() => {
    const l = window.parent.getFormLayout();
    setLayout(l);
  }, []);

  return (
    <div className={styles.container}>
      {/* <EmployeePicker multiple />
      <DepartPicker multiple /> */}
      <FormRender mode="MOBILE" layout={layout} />
    </div>
  );
};

export default MobilePreview;
