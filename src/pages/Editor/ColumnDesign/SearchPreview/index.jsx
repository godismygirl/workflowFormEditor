import React from 'react';
import { useModel } from 'umi';
import { Form, Input, InputNumber, DatePicker, TimePicker, Select } from 'antd';
import { COMP_NAMES } from '@/pages/Editor/AuditForm/consts';
import RangePicker from './RangePicker';
import NumberRange from './NumberRange';
import * as DeskComps from '@/comps/FormRender/DesktopRender/DesktopComps';
import styles from './styles.less';

const SearchPreview = ({ columns }) => {
  const { searchCondition } = useModel('useColumnDesign');

  const sd = columns ?? searchCondition;

  const renderComp = (data) => {
    switch (data.type) {
      case COMP_NAMES.INPUT:
      case COMP_NAMES.TEXT_AREA:
        return <DeskComps.Input {...data.attrs} />;
      case COMP_NAMES.INPUT_NUMBER:
        // return <DeskComps.InputNumber {...data.attrs} style={{ width: 150 }} />;
        return <NumberRange {...data.attrs} />;
      case COMP_NAMES.DATE_PICKER:
        return <RangePicker {...data.attrs} />;
      case COMP_NAMES.TIME_PICKER:
        return <RangePicker {...data.attrs} showTime />;
      case COMP_NAMES.RADIO:
        return <DeskComps.Select {...data.attrs} style={{ width: 150 }} />;
      case COMP_NAMES.CHECKBOX:
        return (
          <DeskComps.Select
            {...data.attrs}
            mode="tags"
            style={{ width: 150 }}
          />
        );
      case COMP_NAMES.EMPLOYEE_PICKER:
        return (
          <DeskComps.EmployeePicker {...data.attrs} style={{ width: 180 }} />
        );
      case COMP_NAMES.DEPART_PICKER:
        return (
          <DeskComps.DepartPicker {...data.attrs} style={{ width: 180 }} />
        );
      case COMP_NAMES.ORG_PICKER:
        return <DeskComps.OrgPicker {...data.attrs} style={{ width: 180 }} />;
      default:
    }
  };

  return (
    <>
      {sd?.map(
        (el) =>
          el.enabled && (
            <Form.Item key={el.id} name={el.id} label={el.attrs?.label}>
              {renderComp(el)}
            </Form.Item>
          ),
      )}
    </>
  );
};

export default React.memo(SearchPreview);
