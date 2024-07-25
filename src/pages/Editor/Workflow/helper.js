import { uid } from 'uid';
import { request } from 'umi';
import { NODE_TYPE, NEED_SIGN_MODEL } from './consts';

export const getNodeTpl = ({ type, childNode, conditions }) => {
  switch (type) {
    case NODE_TYPE.APPROVER: {
      return {
        nodeType: NODE_TYPE.APPROVER,
        nodeId: NODE_TYPE.APPROVER + uid(), //生成唯一id
        nodeName: '审批人',
        childNode,
        conditions,
        userTaskType: 'MULTI',
        // approvalConfig: {}, //审批配置
        // actions: [], //处理按钮配置
      };
    }

    case NODE_TYPE.COPY: {
      return {
        nodeType: NODE_TYPE.COPY,
        nodeId: NODE_TYPE.COPY + uid(), //生成唯一id
        nodeName: '抄送人',
        childNode,
        conditions,
        //approvalConfig: {},
      };
    }

    case NODE_TYPE.CONNECTOR: {
      return {
        nodeType: NODE_TYPE.CONNECTOR,
        nodeId: NODE_TYPE.CONNECTOR + uid(), //生成唯一id
        nodeName: '连接器',
        childNode,
        conditions,
        connectRules: [],
      };
    }

    case NODE_TYPE.CONDITION: {
      return {
        nodeType: NODE_TYPE.CONDITION,
        nodeId: NODE_TYPE.CONDITION + uid(), //生成唯一id
        nodeName: '条件分支',
      };
    }

    case NODE_TYPE.ROUTE: {
      return {
        nodeType: NODE_TYPE.ROUTE,
        nodeId: NODE_TYPE.ROUTE + uid(),
        conditions: [
          {
            nodeType: NODE_TYPE.CONDITION,
            nodeId: NODE_TYPE.CONDITION + uid(),
            nodeName: '条件1',
            childNode,
          },
          {
            nodeType: NODE_TYPE.CONDITION,
            nodeId: NODE_TYPE.CONDITION + uid(),
            nodeName: '其他情况',
            defaultCondition: true,
          },
        ],
      };
    }

    case NODE_TYPE.DUE_ROUTE: {
      return {
        nodeType: NODE_TYPE.DUE_ROUTE,
        nodeId: NODE_TYPE.DUE_ROUTE + uid(),
        childNode,
        conditions: [
          {
            nodeType: NODE_TYPE.DUE_CONDITION,
            nodeId: NODE_TYPE.DUE_CONDITION + uid(),
            nodeName: '超过1天未处理',
          },
          {
            nodeType: NODE_TYPE.DUE_CONDITION,
            nodeId: NODE_TYPE.DUE_CONDITION + uid(),
            nodeName: '时效内完成',
            defaultCondition: true,
          },
        ],
      };
    }

    case NODE_TYPE.START: {
      return {
        nodeType: NODE_TYPE.APPROVER,
        nodeId: NODE_TYPE.START,
        nodeName: '开始',
        startTask: true,
      };
    }
  }
};

export const digChildNode = (nodeData) => {
  let result;
  function find(data) {
    if (data.childNode) {
      find(data.childNode);
    }
    result = data;
  }
  find(nodeData);
  return result;
};

export const findNode = (nodeId, processData) => {
  let result;
  function find(data) {
    if (data.nodeId === nodeId) {
      result = data;
      return;
    }
    if (!data.conditions && !data.childNode) return;
    if (data.conditions) {
      data.conditions.map((c) => {
        find(c);
      });
    }

    if (data.childNode) {
      find(data.childNode);
    }
  }
  find(processData);
  return result;
};

export const findParentNode = (nodeId, processData) => {
  let result;
  function find(data) {
    if (!data.conditions && !data.childNode) return;

    if (data.conditions) {
      const found = data.conditions.find((c) => c.nodeId === nodeId);
      if (found) {
        result = data;
        return;
      }
      data.conditions.map((c) => {
        find(c);
      });
    }

    if (data.childNode) {
      if (data.childNode.nodeId === nodeId) {
        result = data;
        return;
      }
      find(data.childNode);
    }
  }
  find(processData);
  return result;
};
