import React, { useMemo } from 'react';
import { useModel } from 'umi';
import { CloseOutlined, RightOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import { COMP_NAMES } from '@/pages/Editor/AuditForm/consts';
import AddNodeBtn from '../AddNodeBtn';
import styles from './styles.less';

const ConditionNode = ({
  nodeName,
  nodeId,
  defaultCondition,
  conditionIndex,
  condition,
}) => {
  const { activeNode, errorNodes, activeProcessNode, removeCondition } =
    useModel('useWorkflow');

  const isActive = activeNode?.nodeId === nodeId;
  const isError = errorNodes.find((el) => el.nodeId === nodeId);

  const tagClass = useMemo(() => {
    let classStr = styles.condition;
    if (isError) classStr += ' ' + styles.errorTag;
    if (isActive) classStr += ' ' + styles.activeTag;

    return classStr;
  }, [isActive, isError]);

  const showNodePanel = () => {
    activeProcessNode(nodeId);
  };

  const removeBranch = (e) => {
    e.stopPropagation();
    removeCondition(nodeId);
  };

  const renderConditionText = (rule) => {
    const [type, _] = rule.key.split('-');
    let pre = '';
    let end = '';

    switch (type) {
      case 'BI_INITIATOR':
        {
          pre = '发起人';
          end = rule?.value?.map((el) => el.name)?.join('，');
        }
        break;

      case 'BI_INITIATOR_DEPART':
        {
          pre = '发起人部门';
          end = rule?.value?.map((el) => el.name)?.join('，');
        }
        break;

      case 'BI_INITIATOR_ROLE':
        {
          pre = '发起人角色';
          end = rule?.value?.map((el) => el.name)?.join('，');
        }
        break;

      case 'BI_INITIATOR_ORG':
        {
          pre = '发起人单位';
          end = rule?.value?.map((el) => el.name)?.join('，');
        }
        break;

      case COMP_NAMES.INPUT:
        {
          pre = '单行文本';
          end = rule?.value?.[0] ?? '';
        }
        break;

      case COMP_NAMES.TEXT_AREA:
        {
          pre = '多行文本';
          end = rule?.value?.[0] ?? '';
        }
        break;

      case COMP_NAMES.RADIO:
        {
          pre = '单选框';
          end = rule?.value?.[0];
        }
        break;

      default:
    }

    const center =
      rule.equationType === 'IN' ? '等于任意一个：' : '不等于任意一个：';

    return pre + center + end;
  };

  return (
    <div className={styles.conditionWrapper}>
      <div className={tagClass} onClick={showNodePanel}>
        <div className={styles.header}>
          <div className={styles.stream}>{nodeName}</div>
          <div className={styles.priority}>优先级{conditionIndex + 1}</div>
        </div>
        <div className={styles.body}>
          {defaultCondition ? (
            <span className={styles.hasResult}>其他情况进入此流程</span>
          ) : (
            <>
              {condition?.rules?.length > 0 ? (
                <span className={styles.hasResult}>
                  {renderConditionText(condition.rules[0])}
                </span>
              ) : (
                <span className={styles.noResult}>请设置条件</span>
              )}
            </>
          )}
          <i className={styles.arrow}>
            <RightOutlined />
          </i>
        </div>
        {!defaultCondition && (
          <Space className={styles.toolbar}>
            <div className={styles.delBtn} onClick={removeBranch}>
              <CloseOutlined style={{ fontSize: 12, color: '#fff' }} />
            </div>
          </Space>
        )}
      </div>
      <AddNodeBtn nodeId={nodeId} />
    </div>
  );
};

export default React.memo(ConditionNode);
