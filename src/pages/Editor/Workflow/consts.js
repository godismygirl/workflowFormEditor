export const NODE_TYPE = {
  START: 'START',
  APPROVER: 'TASK',
  ROUTE: 'ROUTE',
  CONDITION: 'CONDITION',
  DUE_ROUTE: 'DUE_ROUTE',
  DUE_CONDITION: 'DUE_CONDITION',
  COPY: 'CC',
  CONNECTOR: 'CONNECTOR',
};

export const NEED_SIGN_MODEL = {
  defaultValue: false,
  id: 'needSign',
  name: '需要签名',
  type: 'boolean',
};

export const REUSE_SIGN_MODEL = {
  defaultValue: true,
  id: 'reuseSign',
  name: '复用上次签名',
  type: 'boolean',
};

export const APPROVAL_MAP = {
  SELF_DESIGNATED: '发起人自选',
  DESIGNATED_USER: '指定人员',
  DESIGNATED_ROLE: '指定角色',
  DESIGNATED_POST: '指定岗位',
  INITIATOR: '发起人本人',
  LAST_NODE_DESIGNATED: '上级审批人自选',
  USER_IN_FORM: '表单内联系人',
  ORG_IN_FORM: '表单内单位',
  DEPART_IN_FORM: '表单内部门',
  DEPART_HEAD: '部门主管',
  DEPART_CHARGE: '分管领导',
};
