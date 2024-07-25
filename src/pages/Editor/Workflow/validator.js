export const validateApprover = (data) => {
  const { nodeName, approvalConfig } = data;
  //审批人指定人员和指定角色必须选中一个
  if (!nodeName) return false;
  if (!approvalConfig?.key) return false;
  if (
    approvalConfig?.key === 'DESIGNATED_USER' ||
    approvalConfig?.key === 'DESIGNATED_ROLE' ||
    approvalConfig?.key === 'USER_IN_FORM' ||
    approvalConfig?.key === 'LAST_NODE_DESIGNATED'
  ) {
    if (!approvalConfig?.approvalObjects?.length > 0) return false;
  }

  return true;
};

export const validateCondition = (data) => {
  //其他分支直接过
  if (data.defaultCondition) return true;
  return data?.condition?.rules?.length > 0;
};

export const validateCarbonCopy = (data) => {
  if (!data.nodeName) return false;
  return !!data?.approvalConfig?.key;
};
