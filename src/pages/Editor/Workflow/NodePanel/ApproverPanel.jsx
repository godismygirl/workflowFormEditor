import React, { useState, useEffect, useMemo } from 'react';
import { useModel } from 'umi';
import { Form, Select, Button, Radio, message } from 'antd';
import { COMP_NAMES } from '@/pages/Editor/AuditForm/consts';
import { PanelHeader, ApproverPicker, AuditType, ButtonConfig } from './comps';
import EmployeePicker from '@/comps/EmployeePicker';
import PropSettings from './comps/PropSettings';
import TimeoutSettings from './comps/TimeoutSettings';
import NeedSignature from './comps/NeedSignature';
import AutoDispatch from './comps/AutoDispatch';
import {
  DepartHeadSelect,
  DepartChargeSelect,
  PostRangeSelect,
  RoleRangeSelect,
  ParentApproverSelect,
} from './comps/ApproverPicker';
import style from './style.less';

const APPROVER_KEY_MAP = [
  'DESIGNATED_ROLE',
  'DEPART_HEAD',
  'ORG_IN_FORM',
  'DEPART_IN_FORM',
  'DEPART_CHARGE', //分管领导
  'DESIGNATED_POST', //指定岗位
  'DESIGNATED_USER',
];

const APPROVER_WITH_FILTER = [
  'DESIGNATED_ROLE',
  'DESIGNATED_POST',
  'DEPART_HEAD',
];

const ApproverPanel = ({ data }) => {
  const {
    nodeId,
    nodeName,
    approvalConfig,
    signRequired,
    fieldConfigs,
    autoForwardConfig,
    dueCondition,
    actions,
  } = data;
  const { layout } = useModel('useFormLayout');
  const { errorNodes, activeProcessNode, updateProcessNode, validateProcess } =
    useModel('useWorkflow');

  const [form] = Form.useForm();
  const [configType, setConfiType] = useState('BASIC');
  const approverKey = Form.useWatch('approverKey', form);
  const approverSet = Form.useWatch('approverSet', form);

  //表单内人员
  const employeePickerList = useMemo(() => {
    const result = layout.filter(
      (el) => el.type === COMP_NAMES.EMPLOYEE_PICKER,
    );
    return result ?? [];
  }, [layout]);

  //表单内公司
  const orgPickerList = useMemo(() => {
    const result = layout.filter((el) => el.type === COMP_NAMES.ORG_PICKER);
    return result ?? [];
  }, [layout]);

  //表单内部门
  // const departPickerList = useMemo(() => {
  //   const result = layout.filter((el) => el.type === COMP_NAMES.DEPART_PICKER);
  //   return result ?? [];
  // }, [layout]);

  const showAuditType = useMemo(() => {
    return (
      APPROVER_KEY_MAP.includes(approverKey) ||
      (approverKey === 'DESIGNATED_USER' &&
        approverSet?.approvalObjects?.length > 1)
    );
  }, [approverKey, approverSet]);

  const hasError = useMemo(() => {
    const target = errorNodes.find((el) => el.nodeId === nodeId);
    return !!target;
  }, []);

  const renderApproverSet = () => {
    switch (approverKey) {
      case 'DESIGNATED_USER':
        return (
          <div className={style.approverSet}>
            <Form.Item name="approverSet" rules={[{ required: true }]} noStyle>
              <EmployeePicker multiple />
            </Form.Item>
          </div>
        );

      case 'DESIGNATED_ROLE':
        return (
          <div className={style.approverSet}>
            <Form.Item rules={[{ required: true }]} name="approverSet" noStyle>
              <RoleRangeSelect />
            </Form.Item>
          </div>
        );
      case 'DESIGNATED_POST':
        return (
          <div className={style.approverSet}>
            <Form.Item rules={[{ required: true }]} name="approverSet" noStyle>
              <PostRangeSelect />
            </Form.Item>
          </div>
        );

      case 'ORG_IN_FORM':
        return (
          <div className={style.approverSet}>
            <Form.Item name="approverSet" rules={[{ required: true }]} noStyle>
              <Select
                labelInValue
                options={orgPickerList?.map((el) => ({
                  label: el?.attrs?.label,
                  value: el.id,
                }))}
              />
            </Form.Item>
          </div>
        );

      case 'DEPART_IN_FORM':
        return (
          <div className={style.approverSet}>
            <Form.Item name="approverSet" rules={[{ required: true }]} noStyle>
              <Select
                labelInValue
                options={employeePickerList?.map((el) => ({
                  label: el?.attrs?.label,
                  value: el.id,
                }))}
              />
            </Form.Item>
          </div>
        );

      case 'DEPART_HEAD':
        return (
          <div className={style.approverSet}>
            <Form.Item name="approverSet" rules={[{ required: true }]} noStyle>
              <DepartHeadSelect />
            </Form.Item>
          </div>
        );

      case 'DEPART_CHARGE':
        return (
          <div className={style.approverSet}>
            <Form.Item name="approverSet" rules={[{ required: true }]} noStyle>
              <DepartChargeSelect />
            </Form.Item>
          </div>
        );

      case 'LAST_NODE_DESIGNATED':
        return (
          <div className={style.approverSet}>
            <Form.Item name="approverSet" noStyle>
              <ParentApproverSelect />
            </Form.Item>
          </div>
        );

      default:
    }
  };

  const onApproverKeyChange = (key) => {
    form.resetFields(['approverSet']);
    //设置初始值
    switch (key) {
      case 'DESIGNATED_USER':
        {
          //指定人员
          setTimeout(() => {
            //直接先校验触发红框，跟别的自定义组件保持行为一致
            form.validateFields(['approverSet']);
          }, 0);
        }
        break;

      case 'DEPART_HEAD':
        {
          //分管领导
          form.setFieldsValue({
            approverSet: {
              approvalObjects: [{ id: 'initiator', name: '发起人主管' }],
              filter: { departHeadFilter: { type: 'ALL' } },
            },
          });
        }
        break;

      case 'DEPART_CHARGE':
        {
          //分管领导
          form.setFieldsValue({
            approverSet: [{ id: 'initiator', name: '发起人分管领导' }],
          });
        }
        break;

      default:
    }
  };

  const saveNode = async () => {
    try {
      const formData = await form.validateFields();
      const approvalConfig = formData.approverSet?.approvalObjects
        ? {
            key: formData.approverKey,
            approvalMethod: formData.approvalMethod,
            ...formData.approverSet,
          }
        : {
            key: formData.approverKey,
            approvalMethod: formData.approvalMethod,
            approvalObjects: formData.approverSet,
          };

      const nodeData = {
        actions: formData.actions,
        approvalConfig,
        autoForwardConfig: formData.autoForwardConfig,
        dueCondition: formData.dueCondition,
        signRequired: formData.signRequired,
      };

      updateProcessNode(nodeId, nodeData);
      message.success('保存成功');
      activeProcessNode(null);
      validateProcess();
    } catch (error) {
      message.error('请完成必填项');
    }
  };

  useEffect(() => {
    //set value on panel show
    hasError && form.validateFields();
  }, [hasError]);

  useEffect(() => {
    if (nodeId) {
      form.setFieldsValue({
        approverKey: approvalConfig?.key || 'INITIATOR', //默认INITIATOR
        actions,
        signRequired: !!signRequired,
        dueCondition: dueCondition,
        autoForwardConfig: autoForwardConfig || { toAdmin: 'ALL' },
      });

      if (APPROVER_WITH_FILTER.includes(approvalConfig?.key)) {
        if (approvalConfig?.filter && approvalConfig?.approvalObjects) {
          form.setFieldsValue({
            approverSet: {
              filter: approvalConfig?.filter,
              approvalObjects: approvalConfig?.approvalObjects,
            },
          });
        }
      } else {
        form.setFieldsValue({ approverSet: approvalConfig?.approvalObjects });
      }

      if (approvalConfig?.approvalMethod) {
        form.setFieldsValue({ approvalMethod: approvalConfig.approvalMethod });
      }
      setConfiType('BASIC');
    }
  }, [nodeId]);

  return (
    <>
      <PanelHeader
        nodeId={nodeId}
        nodeType={data.nodeType}
        nodeName={nodeName}
      />
      <div className={style.body}>
        <div className={style.switch}>
          <Radio.Group
            className={style.radioGroup}
            value={configType}
            onChange={(e) => setConfiType(e.target.value)}
            optionType="button"
            buttonStyle="solid"
            options={[
              { label: '基本设置', value: 'BASIC' },
              { label: '字段权限', value: 'AUTH' },
            ]}
          />
        </div>
        {configType === 'BASIC' ? (
          <Form form={form}>
            <Form.Item name="approverKey" rules={[{ required: true }]}>
              <ApproverPicker showTitle onChange={onApproverKeyChange} />
            </Form.Item>
            {renderApproverSet()}

            <div className={style.divider}></div>

            <Form.Item name="actions">
              <ButtonConfig />
            </Form.Item>

            {showAuditType && (
              <>
                <div className={style.divider}></div>
                <Form.Item
                  name="approvalMethod"
                  rules={[{ required: true }]}
                  initialValue="ALL"
                >
                  <AuditType />
                </Form.Item>
              </>
            )}

            <Form.Item name="autoForwardConfig" rules={[{ required: true }]}>
              <AutoDispatch />
            </Form.Item>

            <Form.Item name="dueCondition">
              <TimeoutSettings />
            </Form.Item>

            <Form.Item name="signRequired" initialValue={false}>
              <NeedSignature />
            </Form.Item>
          </Form>
        ) : (
          <PropSettings nodeId={nodeId} config={fieldConfigs} />
        )}
      </div>
      <div className={style.footer}>
        <Button type="primary" block onClick={saveNode}>
          保存节点配置
        </Button>
      </div>
    </>
  );
};

export default React.memo(ApproverPanel);
