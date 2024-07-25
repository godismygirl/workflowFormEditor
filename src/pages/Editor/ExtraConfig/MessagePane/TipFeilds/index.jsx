import React, { useState, useEffect } from 'react';
import { useModel } from 'umi';
import { Modal, Checkbox } from 'antd';
import { COMP_NAMES } from '@/pages/Editor/AuditForm/consts';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableItem from './SortableItem';
import styles from './styles.less';

const TipFields = ({ value, onChange }) => {
  //value format [{id, name}];
  const { layout } = useModel('useFormLayout');
  const [open, setOpen] = useState(false);
  const [tipResult, setTipResult] = useState([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 20,
      },
    }),
  );

  const onCheckChange = ({ checked, id, name }) => {
    let prev = tipResult;
    if (checked) {
      //最多勾中5个
      if (tipResult.length === 5) return;
      setTipResult?.([...prev, { id, name }]);
    } else {
      const after = tipResult.filter((el) => el.id !== id);
      setTipResult?.(after);
    }
  };

  const isChecked = (cmpId) => {
    return !!tipResult.find((el) => el.id === cmpId);
  };

  const renderCmpList = () => {
    const validCmps = layout?.filter((el) => el.type !== COMP_NAMES.GROUP);

    return (
      <>
        <div className={styles.row}>
          <Checkbox
            value="initiator"
            checked={isChecked('initiator')}
            onChange={(e) =>
              onCheckChange({
                checked: e.target.checked,
                id: 'initiator',
                name: '申请人',
              })
            }
          >
            申请人
          </Checkbox>
        </div>
        <div className={styles.row}>
          <Checkbox
            value="initiatorOrg"
            checked={isChecked('initiatorOrg')}
            onChange={(e) =>
              onCheckChange({
                checked: e.target.checked,
                id: 'initiatorOrg',
                name: '申请单位',
              })
            }
          >
            申请单位
          </Checkbox>
        </div>
        <div className={styles.row}>
          <Checkbox
            value="startTime"
            checked={isChecked('startTime')}
            disabled
            onChange={(e) =>
              onCheckChange({
                checked: e.target.checked,
                id: 'startTime',
                name: '申请时间',
              })
            }
          >
            申请时间
          </Checkbox>
        </div>

        {validCmps?.map((el) => (
          <div className={styles.row} key={el.id}>
            <Checkbox
              value={el.id}
              checked={isChecked(el.id)}
              onChange={(e) =>
                onCheckChange({
                  checked: e.target.checked,
                  id: el.id,
                  name: el.attrs.label,
                })
              }
            >
              {el.attrs.label}
            </Checkbox>
          </div>
        ))}
      </>
    );
  };

  const updateValueIndex = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setTipResult((items) => {
        const oldIndex = items.findIndex((el) => el.id === active.id);
        const newIndex = items.findIndex((el) => el.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  useEffect(() => {
    if (value?.length > 0) {
      setTipResult(value);
    }
  }, [value]);

  return (
    <>
      <div className={styles.box} onClick={() => setOpen(true)}>
        {value?.map((el) => (
          <div className={styles.previewRow} key={el.id}>
            {el.name}
          </div>
        ))}
      </div>
      <Modal
        title="摘要设置"
        open={open}
        width={800}
        okText="保存"
        cancelText="取消"
        onCancel={() => setOpen(false)}
        onOk={() => {
          onChange?.(tipResult);
          setOpen(false);
        }}
        //afterClose={() => setTipResult([])}
        //destroyOnClose
      >
        <div className={styles.container}>
          <div className={styles.compList}>
            <div className={styles.header}>
              审批单字段 <span className={styles.subDesc}>最多选中5个</span>
            </div>
            <div className={styles.body}>{renderCmpList()}</div>
          </div>
          <div className={styles.actionList}>
            <div className={styles.header}>摘要显示字段</div>
            <div className={styles.body}>
              <DndContext onDragEnd={updateValueIndex} sensors={sensors}>
                <SortableContext
                  items={tipResult}
                  strategy={verticalListSortingStrategy}
                >
                  {tipResult?.map((el) => (
                    <SortableItem key={el.id} {...el} />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TipFields;
