import React, { useMemo } from 'react';
import { useModel } from 'umi';
import { Radio, Row, Col, Select } from 'antd';
import { COMP_NAMES } from '@/pages/Editor/AuditForm/consts';
import DepartHeadSelect from './DepartHeadSelect';
import DepartChargeSelect from './DepartChargeSelect';
import PostRangeSelect from './PostRangeSelect';
import RoleRangeSelect from './RoleRangeSelect';
import ParentApproverSelect from './ParentApproverSelect';
import styles from './styles.less';

export {
  DepartHeadSelect,
  DepartChargeSelect,
  PostRangeSelect,
  RoleRangeSelect,
  ParentApproverSelect,
};

//value format { key : 'xxx', approvalObjects: [{name: xxx, id: xxx}] }

const ApproverPicker = ({ value, onChange, showTitle, ...rest }) => {
  const { layout } = useModel('useFormLayout');

  //表单内人员
  const employeePickerList = useMemo(() => {
    const result = layout.filter(
      (el) => el.type === COMP_NAMES.EMPLOYEE_PICKER,
    );
    return result ?? [];
  }, [layout]);

  //表单内公司
  // const orgPickerList = useMemo(() => {
  //   const result = layout.filter((el) => el.type === COMP_NAMES.ORG_PICKER);
  //   return result ?? [];
  // }, [layout]);

  //表单内部门
  const departPickerList = useMemo(() => {
    const result = layout.filter((el) => el.type === COMP_NAMES.DEPART_PICKER);
    return result ?? [];
  }, [layout]);

  return (
    <div>
      {showTitle && <div className={styles.title}>设置审批人</div>}
      <div className={styles.row}>
        <Radio.Group
          style={{ width: '100%' }}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          {...rest}
        >
          <Row gutter={[5, 5]}>
            <Col span={8}>
              <Radio value="INITIATOR">发起人本人</Radio>
            </Col>

            <Col span={8}>
              <Radio value="DESIGNATED_USER">指定人员</Radio>
            </Col>
            <Col span={8}>
              <Radio value="DESIGNATED_ROLE">指定角色</Radio>
            </Col>
            <Col span={8}>
              <Radio value="DESIGNATED_POST">指定岗位</Radio>
            </Col>
            <Col span={8}>
              <Radio
                disabled={!employeePickerList?.length > 0}
                value="USER_IN_FORM"
              >
                表单内联系人
              </Radio>
            </Col>

            <Col span={8}>
              <Radio disabled value="SELF_DESIGNATED">
                发起人自选
              </Radio>
            </Col>

            <Col span={8}>
              <Radio value="LAST_NODE_DESIGNATED">上级审批人自选</Radio>
            </Col>

            {/* <Col span={6}>
              <Radio disabled={!orgPickerList?.length > 0} value="ORG_IN_FORM">
                表单内单位
              </Radio>
            </Col> */}
            <Col span={8}>
              <Radio
                disabled={!departPickerList?.length > 0}
                value="DEPART_IN_FORM"
              >
                表单内部门
              </Radio>
            </Col>
            <Col span={8}>
              <Radio value="DEPART_HEAD">部门主管</Radio>
            </Col>
            <Col span={8}>
              <Radio value="DEPART_CHARGE">分管领导</Radio>
            </Col>
          </Row>
        </Radio.Group>
      </div>
    </div>
  );
};

export default ApproverPicker;
