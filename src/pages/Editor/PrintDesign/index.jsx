import React, { useMemo, useEffect, useState } from 'react';
import { useModel } from 'umi';
import { uid } from 'uid';
import { Divider, message } from 'antd';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { CATEGORY, COMP_NAMES } from '@/pages/Editor/AuditForm/consts';
import { TAB_KEY } from '..';
import DragItem from './DragItem';
import DropArea from './DropArea';
import SheetArea from './SheetArea';
import PreviewButton, { PreviewRender } from './PreviewButton';
import styles from './styles.less';

export { PreviewRender };

const PrintDesign = ({ data }) => {
  const [activeDragItem, setActiveDragItem] = useState();
  const { layout } = useModel('useFormLayout');
  const { process } = useModel('useWorkflow');
  const { open, updateResult, updateStatus } = useModel('useSaveProgress');

  const printList = useMemo(() => {
    let result = [];

    layout?.map((el) => {
      if (
        el.category === CATEGORY.INTERACT ||
        el.category === CATEGORY.BUSINESS
      ) {
        result.push(el);
      }

      if (el.category === CATEGORY.LAYOUT) {
        if (el.type === COMP_NAMES.SECTION) {
          el.children?.map((c) => {
            if (
              c.category === CATEGORY.INTERACT ||
              c.category === CATEGORY.BUSINESS
            ) {
              result.push(c);
            }
          });
        }

        if (el.type === COMP_NAMES.GROUP) {
          result.push(el);
        }
      }
    });

    return result;
  }, [layout]);

  const signNodeList = useMemo(() => {
    let signs = [];
    const loop = (nodeData) => {
      if (nodeData.signRequired) {
        signs.push({ nodeId: nodeData.nodeId, nodeName: nodeData.nodeName });
      }

      if (nodeData.childNode) {
        loop(nodeData.childNode);
      }
      if (nodeData.conditions) {
        nodeData.conditions.map((el) => loop(el));
      }
    };
    loop(process);
    return signs;
  }, [process]);

  const dropItem = (dragComp) => {
    const select = luckysheet.getRangeValuesWithFlatte();

    if (!select?.length > 0) {
      message.error('请先选中单元格再拖拽组件绑定');
      return;
    }

    const firstCell = select[0];

    //先取mc里的数据，如果没有，取range里的

    if (firstCell?.mc) {
      luckysheet.setCellValue(
        firstCell.mc.r,
        firstCell.mc.c,
        dragComp.attrs.label,
      );

      luckysheet.setCellValue(
        firstCell.mc.r,
        firstCell.mc.c + (firstCell.mc.cs ? firstCell.mc.cs : 1),
        dragComp.type === 'SIGNATURE' ? `#${dragComp.id}` : `$${dragComp.id}`,
      );
    } else {
      const range = luckysheet.getRangeWithFlatten();
      const firtTd = range[0];

      luckysheet.setCellValue(firtTd.r, firtTd.c, dragComp.attrs.label);

      let gcid = '';
      switch (dragComp.type) {
        case 'SIGNATURE':
          gcid = `#${dragComp.id}`;
          break;
        case 'ADUIT_GROUP':
          gcid = dragComp.id;
          break;
        default:
          gcid = `$${dragComp.id}`;
      }
      luckysheet.setCellValue(firtTd.r, firtTd.c + 1, gcid);
    }
  };

  const dropGroup = (dragComp) => {
    const select = luckysheet.getRangeValuesWithFlatte();

    if (!select?.length > 0) {
      message.error('请先选中单元格再拖拽组件绑定');
      return;
    }

    const range = luckysheet.getRangeWithFlatten();
    const firtTd = range[0];

    //null 空单元格
    // {mc：{r, c}} 被合并过的单元格
    //{mc：{r, c, rs, cs}}合并过的单元格第一个
    dragComp.children?.map((c, i) => {
      const ci = firtTd.c + i;

      //先生成表头
      const headRange = {
        row: [firtTd.r, firtTd.r],
        column: [ci, ci],
      };
      //选区改变到目标位置
      luckysheet.setRangeShow(headRange);
      const head = luckysheet.getRangeValue();

      //如果经过被合并过的单元格，先取消合并
      if (head[0][0]?.mc) {
        luckysheet.cancelRangeMerge({
          range: headRange,
        });
      }

      //标记子表单开始位置子表单元素数量和id
      const cmpIds = dragComp.children?.map((el) => el.id);
      const cmpStr = cmpIds.join('/');

      const labels = dragComp.children?.map((el) => el.attrs.label);
      const labelStr = labels.join('/');

      if (i === 0) {
        luckysheet.setCellValue(
          firtTd.r,
          ci,
          `@${dragComp.children.length}=${dragComp.id}=${labelStr}=${cmpStr}=${c.attrs.label}`,
        );
      } else {
        luckysheet.setCellValue(firtTd.r, ci, '/' + c.attrs.label);
      }

      luckysheet.setCellFormat(firtTd.r, ci, 'bd', {
        borderType: 'border-all',
        style: '1',
        color: '#1abc9c',
      });

      //再生成value
      const bodyRange = {
        row: [firtTd.r + 1, firtTd.r + 1],
        column: [ci, ci],
      };

      luckysheet.setRangeShow(bodyRange);
      const body = luckysheet.getRangeValue();
      //如果选中最后一行拖入子表单
      if (!body[0]) return;

      if (body[0][0]?.mc) {
        luckysheet.cancelRangeMerge({
          range: bodyRange,
        });
      }
      luckysheet.setCellValue(firtTd.r + 1, ci, `/${c.id}`);
      luckysheet.setCellFormat(firtTd.r + 1, ci, 'bd', {
        borderType: 'border-all',
        style: '1',
        color: '#1abc9c',
      });
    });
  };

  const handleDragEnd = (event) => {
    setActiveDragItem(null);
    if (event.over && event.over.id === 'droppable') {
      const dragComp = event.active.data.current;

      //debugger;
      if (dragComp.type === COMP_NAMES.GROUP) {
        dropGroup(dragComp);
      } else {
        dropItem(dragComp);
      }
    }
  };

  useEffect(() => {
    if (open) {
      const config = window.luckysheet.toJson();
      updateStatus({
        [TAB_KEY.PRINT]: 'finish',
      });
      updateResult({
        [TAB_KEY.PRINT]: {
          printConfig: config,
        },
      });
    }
  }, [open]);

  return (
    <DndContext
      onDragStart={(e) => {
        setActiveDragItem(e.active.data.current);
      }}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.container}>
        <div className={styles.side}>
          {printList?.map((el) => (
            <div key={el.id} className={styles.box}>
              <DragItem id={el.id} name={el.attrs?.label} data={el} />
            </div>
          ))}
          <DragOverlay>
            {activeDragItem ? (
              <DragItem
                id={activeDragItem.id}
                name={activeDragItem.attrs?.label}
                data={activeDragItem}
              />
            ) : null}
          </DragOverlay>
          <Divider orientation="center">审批</Divider>
          {
            <DragItem
              id="*ADUIT_GROUP"
              name="审批意见"
              data={{
                id: '*ADUIT_GROUP',
                type: 'ADUIT_GROUP',
                attrs: { label: '审批意见' },
              }}
            />
          }
          <Divider orientation="center">签名</Divider>
          {signNodeList?.map((el) => (
            <div key={el.nodeId} className={styles.box}>
              <DragItem
                id={el.nodeId}
                name={el.nodeName}
                data={{
                  id: el.nodeId,
                  type: 'SIGNATURE',
                  attrs: { label: el.nodeName },
                }}
              />
            </div>
          ))}
        </div>
        <DropArea>
          <div className={styles.content}>
            <div className={styles.mask}></div>
            <SheetArea initConfig={data} />
            <div className={styles.btn}>
              <PreviewButton />
            </div>
          </div>
        </DropArea>
      </div>
    </DndContext>
  );
};

export default React.memo(PrintDesign);
