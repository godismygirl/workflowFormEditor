import React, { useEffect } from 'react';
import { Modal } from 'antd';
import { useDrag, useDrop } from 'react-dnd';
import { CloseOutlined, DragOutlined, CopyOutlined } from '@ant-design/icons';
import { COMP_NAMES } from '@/pages/Editor/AuditForm/consts';
import { useStore } from '../formStore';
import styles from './styles.less';

const ActionProvider = ({
  id,
  type,
  category,
  attrs,
  groupBox,
  children,
  inDragProcess,
}) => {
  const {
    layout,
    updateLayoutByItem,
    updateLayoutByGroup,
    activeItem,
    setActiveItem,
    remove,
    copy,
    hasError,
    endDragAction,
  } = useStore();

  const isActive = activeItem?.id === id;

  const [{ isDragging }, drag, dragPreview] = useDrag(
    () => ({
      type: 'DRAGABLE_COMP',
      item: { id, type, category, attrs },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: () => endDragAction(),
    }),
    [layout],
  );

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'DRAGABLE_COMP',
    canDrop: (item, monitor) => {
      return true;
    },

    hover: (item, monitor) => {
      //同为group的话，只能交换位置
      if (groupBox) {
        monitor.isOver({ shallow: true }) &&
          updateLayoutByGroup(item, { id, type, attrs });
      } else {
        updateLayoutByItem(item, { id, type, attrs });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const activeSelf = (e) => {
    e.stopPropagation();
    setActiveItem({ id, type, category, attrs });
  };

  const copyComp = (evt) => {
    evt.stopPropagation();
    copy({ id });
  };

  const removeComp = (evt) => {
    const deleteAction = () => {
      evt.stopPropagation();
      remove({ id });
      setActiveItem();
    };

    //删除人员选择组件时要特殊处理，会同步删除流程里的相关审批配置
    if (type === COMP_NAMES.EMPLOYEE_PICKER) {
      Modal.confirm({
        title: '确定要删除吗',
        content: '将同步删除审批流程中的关联配置',
        okText: '确定',
        cancelText: '取消',
        okType: 'danger',
        onOk: () => {
          deleteAction();
          //removeConfig(id);
        },
      });
    } else {
      deleteAction();
    }
  };

  const getClass = () => {
    let classname = styles.boundBox;

    const isError = hasError(id);
    const isGroupBox = groupBox;

    if (inDragProcess || isDragging) {
      classname = classname + ' ' + styles.dragging;
    }

    if (isActive) {
      classname = classname + ' ' + styles.focus;
    }
    if (isError) {
      classname = classname + ' ' + styles.error;
    }

    if (isGroupBox) {
      classname = classname + ' ' + styles.groupBox;
    }
    return classname;
  };

  return (
    <div ref={drop} onClick={activeSelf} className={styles.formItem}>
      <div ref={dragPreview}>
        <div
          ref={drag}
          className={groupBox ? styles.groupWrapper : styles.actionWrapper}
        >
          <div className={getClass()}>
            {isActive && (
              <>
                <div className={styles.copyIcon} onClick={copyComp}>
                  <CopyOutlined />
                </div>
                <div className={styles.removeIcon} onClick={removeComp}>
                  <CloseOutlined />
                </div>
                {/* <div className={styles.dragIcon}>
                <DragOutlined />
              </div> */}
              </>
            )}
            <div className={styles.formItem}>
              {attrs?.label && (
                <div className={styles.label}>
                  {attrs.required && <i className={styles.required}>*</i>}
                  {attrs.label}
                </div>
              )}
              <div className={styles.content}>{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionProvider;
