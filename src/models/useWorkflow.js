import { useState } from 'react';
import deepCopy from '@/utils/deepCopy';
import { NODE_TYPE, NEED_SIGN_MODEL } from '@/pages/Editor/Workflow/consts';
import {
  validateApprover,
  validateCarbonCopy,
  validateCondition,
} from '@/pages/Editor/Workflow/validator';

import {
  getNodeTpl,
  digChildNode,
  findNode,
  findParentNode,
} from '@/pages/Editor/Workflow/helper';

const useWorkflow = () => {
  const [process, setProcess] = useState(getNodeTpl({ type: NODE_TYPE.START }));

  const [activeNode, setActiveNode] = useState(null);
  const [errorNodes, setErrorNodes] = useState([]);

  const restoreProcess = () => {
    setProcess(getNodeTpl({ type: NODE_TYPE.START }));
  };

  const splitCondition = (nodeId) => {
    let newProcess = deepCopy(process);
    const node = findNode(nodeId, newProcess);
    node.conditions.splice(
      node.conditions.length - 1,
      0,
      getNodeTpl({ type: NODE_TYPE.CONDITION }),
    );
    setProcess(newProcess);
  };

  const addCondition = (nodeId) => {
    let newProcess = deepCopy(process);
    const node = findNode(nodeId, newProcess);

    const grandson = node.childNode && { ...node.childNode };
    node.childNode = getNodeTpl({ type: NODE_TYPE.ROUTE, childNode: grandson });

    setProcess(newProcess);
  };

  const removeCondition = (nodeId) => {
    let newProcess = deepCopy(process);
    const parent = findParentNode(nodeId, newProcess);
    //parent is route
    const restConditions = parent.conditions.filter((c) => c.nodeId !== nodeId);
    parent.conditions = deepCopy(restConditions);

    if (parent.conditions.length === 1) {
      //remove whole branch when only one node exist
      const branch = parent.conditions[0].childNode;
      const grandParent = findParentNode(parent.nodeId, newProcess);

      if (branch) {
        if (parent.childNode) {
          const deepestChild = digChildNode(branch);
          deepestChild.childNode = { ...parent.childNode };
        }
        grandParent.childNode = { ...branch };
      } else {
        // condition node without a child
        const grandson = grandParent.childNode?.childNode;
        delete grandParent.childNode;
        if (grandson) {
          grandParent.childNode = grandson;
        } else {
          delete grandParent.childNode;
        }
      }
    }
    setProcess(newProcess);

    //delete from errorNodes if exist
    const newErrorNodes = errorNodes.filter((node) => node.nodeId !== nodeId);
    setErrorNodes(newErrorNodes);

    if (nodeId === activeNode?.nodeId) {
      setActiveNode(null);
    }
  };

  const addDueCondition = (nodeId) => {
    let newProcess = deepCopy(process);
    const node = findNode(nodeId, newProcess);

    //检查是否已存在超时分支
    if (node.childNode?.nodeType === NODE_TYPE.DUE_ROUTE) {
      return;
    }

    const grandson = node.childNode && { ...node.childNode };
    node.childNode = getNodeTpl({
      type: NODE_TYPE.DUE_ROUTE,
      childNode: grandson,
    });

    setProcess(newProcess);
  };

  const removeDueCondition = (nodeId) => {
    let newProcess = deepCopy(process);
    const node = findNode(nodeId, newProcess);

    const grandson = node.childNode.childNode && {
      ...node.childNode.childNode,
    };

    if (node.childNode?.nodeType === NODE_TYPE.DUE_ROUTE) {
      node.childNode = grandson;
    }
  };

  const removeConfig = (compId) => {
    const loop = (data) => {
      if (!data.conditions && !data.childNode) return;

      if (data.conditions) {
        data.conditions.map((c) => {
          loop(c);
        });
      }

      if (data.childNode) {
        loop(data.childNode);
      }

      if (data.approvalConfig?.approvalObjects?.length > 0) {
        const resultIndex = data.approvalConfig.approvalObjects.findIndex(
          (el) => el.id === compId,
        );
        if (resultIndex !== -1) {
          data.approvalConfig.approvalObjects.splice(resultIndex, 1);
        }
      }
    };

    loop(process);
    setProcess({ ...process });
    return process;
  };

  const updateConfig = (compId, label) => {
    const loop = (data) => {
      if (!data.conditions && !data.childNode) return;

      if (data.conditions) {
        data.conditions.map((c) => {
          loop(c);
        });
      }

      if (data.childNode) {
        loop(data.childNode);
      }

      if (data.approvalConfig?.approvalObjects?.length > 0) {
        const resultIndex = data.approvalConfig.approvalObjects.findIndex(
          (el) => el.id === compId,
        );

        if (resultIndex !== -1) {
          data.approvalConfig.approvalObjects[resultIndex].name = label;
        }
      }
    };

    loop(process);
    setProcess({ ...process });
  };

  const removeConditionValue = (compId) => {
    const loop = (data) => {
      if (data.nodeType === 'CONDITION' && !data.defaultCondition) {
        if (data?.condition?.rules?.[0]?.key === compId) {
          data.condition = undefined;
        }
      }

      if (!data.conditions && !data.childNode) return;

      if (data.conditions) {
        data.conditions.map((c) => {
          loop(c);
        });
      }

      if (data.childNode) {
        loop(data.childNode);
      }
    };

    loop(process);
    setProcess({ ...process });
  };

  const addApprover = (nodeId) => {
    let newProcess = deepCopy(process);
    const node = findNode(nodeId, newProcess);

    //in other case put self as child
    node.childNode = getNodeTpl({
      type: NODE_TYPE.APPROVER,
      childNode: node.childNode && { ...node.childNode },
    });

    if (
      node.nodeType !== NODE_TYPE.ROUTE &&
      node.nodeType !== NODE_TYPE.DUE_ROUTE
    ) {
      delete node.conditions;
    }
    setProcess(newProcess);
  };

  const removeApprover = (nodeId) => {
    let newProcess = deepCopy(process);
    let parent = findParentNode(nodeId, newProcess);
    let self = parent.childNode;

    //delete timeout route if possible
    if (
      self.childNode?.nodeType === NODE_TYPE.ROUTE ||
      self.childNode?.nodeType === NODE_TYPE.DUE_ROUTE
    ) {
      parent.childNode =
        self.childNode.childNode && deepCopy(self.childNode.childNode);
    } else {
      parent.childNode = self.childNode && deepCopy(self.childNode);
    }

    setProcess(newProcess);

    //delete from errorNodes if exist
    const newErrorNodes = errorNodes.filter((node) => node.nodeId !== nodeId);
    setErrorNodes(newErrorNodes);

    //hide active panel if is current
    if (nodeId === activeNode?.nodeId) {
      setActiveNode(null);
    }
  };

  const addCopy = (nodeId) => {
    let newProcess = deepCopy(process);
    const node = findNode(nodeId, newProcess);
    //in other case put self as child
    node.childNode = getNodeTpl({
      type: NODE_TYPE.COPY,
      childNode: node.childNode && { ...node.childNode },
    });

    if (node.nodeType !== NODE_TYPE.ROUTE) {
      delete node.conditions;
    }
    setProcess(newProcess);
  };

  const addConnector = (nodeId) => {
    let newProcess = deepCopy(process);
    const node = findNode(nodeId, newProcess);

    //in other case put self as child
    node.childNode = getNodeTpl({
      type: NODE_TYPE.CONNECTOR,
      childNode: node.childNode && { ...node.childNode },
    });

    if (
      node.nodeType !== NODE_TYPE.ROUTE &&
      node.nodeType !== NODE_TYPE.DUE_ROUTE
    ) {
      delete node.conditions;
    }
    setProcess(newProcess);
  };

  const removeConnector = (nodeId) => {
    removeApprover(nodeId);
  };

  const getUnitCN = (type) => {
    switch (type) {
      case 'DAY':
        return '天';
      case 'HOUR':
        return '小时';
      case 'MINUTE':
        return '分钟';
      default:
    }
  };

  const updateProcessNode = (nodeId, nodeData) => {
    let newProcess = deepCopy(process);

    let node = findNode(nodeId, newProcess);

    for (let key in nodeData) {
      node[key] = nodeData[key];
    }

    //如果是基本设置面板的改变，检查分支操作，字段权限面板不需要
    if (!nodeData.fieldConfigs) {
      //超时分支操作
      if (node.nodeType === NODE_TYPE.APPROVER) {
        if (nodeData.dueCondition) {
          if (node.childNode?.nodeType !== NODE_TYPE.DUE_ROUTE) {
            const grandson = node.childNode && { ...node.childNode };
            node.childNode = getNodeTpl({
              type: NODE_TYPE.DUE_ROUTE,
              childNode: grandson,
            });
          } else {
            //修改超时节点的文字
            node.childNode.conditions[0].nodeName = `超过${
              nodeData.dueCondition.period
            }${getUnitCN(nodeData.dueCondition.timeUnit)}未处理`;
          }
        } else {
          if (node.childNode?.nodeType === NODE_TYPE.DUE_ROUTE) {
            const grandson = node.childNode.childNode && {
              ...node.childNode.childNode,
            };

            if (node.childNode?.nodeType === NODE_TYPE.DUE_ROUTE) {
              node.childNode = deepCopy(grandson);
            }
          }
        }
      }
    }

    if (activeNode?.nodeId === nodeId) {
      setActiveNode(node);
    }

    setProcess(newProcess);
  };

  const activeProcessNode = (taskCode) => {
    if (!taskCode) {
      setActiveNode(null);
      return;
    }
    const active = findNode(taskCode, process);
    setActiveNode(active);
  };

  const updateProcess = (processData) => {
    const data = processData || getNodeTpl({ type: NODE_TYPE.START });
    setProcess(data);
  };

  const validateProcess = (data) => {
    const provide = data || process;
    let errorPool = [];

    function validate(processData) {
      switch (processData.nodeType) {
        case NODE_TYPE.APPROVER:
          {
            if (processData.nodeId !== NODE_TYPE.START) {
              const pass = validateApprover(processData);
              !pass && errorPool.push(processData);
            }
          }
          break;

        case NODE_TYPE.COPY:
          {
            const pass = validateCarbonCopy(processData);
            !pass && errorPool.push(processData);
          }
          break;

        case NODE_TYPE.ROUTE:
          {
            processData.conditions.map((el) => validate(el));
          }
          break;

        case NODE_TYPE.CONDITION:
          {
            const pass = validateCondition(processData);
            !pass && errorPool.push(processData);
          }
          break;

        default:
      }

      if (processData.childNode) {
        validate(processData.childNode);
      }
    }

    validate(provide);
    setErrorNodes(errorPool);
    return errorPool.length === 0;
  };

  const adjustConditions = () => {
    let processCopy = JSON.parse(JSON.stringify(process));

    function adjust(processData) {
      console.log('adjust data', processData);
      if (processData.conditions) {
        const ncChildIndex = processData.conditions.findIndex(
          (el) => !el.conditions,
        );
        if (ncChildIndex !== -1) {
          const ncChild = processData.conditions[ncChildIndex];
          processData.conditions.splice(ncChildIndex, 1);
          processData.conditions.push(ncChild);
        }
        processData.conditions.map((el) => adjust(el));
      }

      if (processData.childNode) {
        adjust(processData.childNode);
      }
    }
    adjust(processCopy);
    return processCopy;
  };

  return {
    taskStartCode: NODE_TYPE.START,
    activeNode,
    errorNodes,
    process,
    setProcess,
    restoreProcess,

    addApprover,
    removeApprover,

    addCopy,
    addConnector,
    removeConnector,

    addCondition,
    addDueCondition,
    splitCondition,
    removeCondition,
    removeDueCondition,
    removeConfig,
    updateConfig,
    removeConditionValue,

    activeProcessNode,
    updateProcessNode,
    updateProcess,
    validateProcess,
    adjustConditions,
  };
};

export default useWorkflow;
