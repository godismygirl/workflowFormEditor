import React from 'react';
import { uid } from 'uid';
import { useModel } from 'umi';
import { Row, Col, Form } from 'antd';
import { COMP_NAMES_MAP, COMP_NAMES } from '@/pages/Editor/AuditForm/consts';
import DesktopRender from './DesktopRender';
import MobileRender from './MobileRender';
import styles from './styles.less';

const FormRender = ({
  form,
  mode,
  layout,
  cols = 2,
  fieldConfigs,
  readOnly,
}) => {
  const isMobile = mode === 'MOBILE';

  return isMobile ? (
    <MobileRender
      layout={layout}
      form={form}
      fieldConfigs={fieldConfigs}
      readOnly={readOnly}
    />
  ) : (
    <DesktopRender
      layout={layout}
      cols={cols}
      form={form}
      fieldConfigs={fieldConfigs}
      readOnly={readOnly}
    />
  );
};

export default FormRender;
