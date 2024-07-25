import { useState } from 'react';
import { message } from 'antd';
import { COMP_NAMES, CATEGORY } from '@/pages/Editor/AuditForm/consts';
import useThrottle from '@/utils/useThrottle';
import { uid } from 'uid';

// group 容器只能 装载 comp item，不能装载group
//group 容器可以和同级item交换位置，但item无法和group交换位置，item只会添加进容器中，或者移出容器
// item 添加进容器，有两种途径：
//1.容器为空，则创建第一个容器内item，调用addToGroup方法
//2.容器内有item，则借助已有item的hover事件向已有item相邻位置添加，调用add方法

const findGroupIndex = (comp, pool) => {
  let result = null;
  const search = (arr, parentType) => {
    arr.some((item, index) => {
      if (item.id === comp.id) {
        result = {
          group: arr,
          groupType: parentType,
          index,
        };
        return true;
      }

      if (item?.children?.length > 0) {
        search(item.children, item.type);
      }
    });
  };

  search(pool);
  return result;
};

const findDraggingComp = (pool) => {
  let result = null;
  const search = (arr) => {
    arr.some((item, index) => {
      if (item.inDragProcess) {
        result = item;
        return true;
      }

      if (item?.children?.length > 0) {
        search(item.children);
      }
    });
  };

  search(pool);
  return result;
};

const unsupportInGroup = (compData) => {
  return false;
};

const useFormLayout = () => {
  const [activeItem, setActiveItem] = useState();
  const [layout, setLayout] = useState([]);
  const [errorPool, setErrorPool] = useState([]);

  const swap = (dragItem, belowItem) => {
    //拖的快的时候，直接交换组件位置体验较差，把逻辑改成，始终把dragItem移动到belowItem上方

    //由于hover事件触发频繁，除了节流，先检查2个item是否同一个
    if (dragItem.id === belowItem.id) return;

    //检查item是否存在，有可能新建的comp拖过来又直接触发了swap行为，此时item还没有更新到layout中
    const dragItemData = findGroupIndex(dragItem, layout);
    if (!dragItemData) return;

    //console.log('dragItem.inDragProcess', dragItem.inDragProcess);

    //检查当drag item是group时
    if (
      dragItem.type === COMP_NAMES.GROUP ||
      dragItem.type === COMP_NAMES.SECTION
    ) {
      //检查是否hover到了自己的children item 上
      const gropuChildren =
        dragItemData.group[dragItemData.index].children || [];
      const inGroup = findGroupIndex(belowItem, gropuChildren);
      if (inGroup) return;

      //检查是否hover到了另一个group里的item上，是则不处理，group之间换位交给swapGroup处理
      const belowInRoot =
        layout.findIndex((el) => el.id === belowItem.id) !== -1;
      if (!belowInRoot) return;
    }

    let newLayout = [...layout];

    //将drag的comp 移入blow所在层并排列在target之前
    const dragResult = findGroupIndex(dragItem, newLayout);
    const dragData = dragResult.group[dragResult.index];
    //
    //
    //dragData.inDragProcess = true;
    //
    //
    dragResult.group.splice(dragResult.index, 1);

    const belowResult = findGroupIndex(belowItem, newLayout);
    belowResult.group.splice(belowResult.index, 0, dragData);
    setLayout(newLayout);
  };

  const add = (dragItem, belowItem) => {
    //向布局内添加新comp
    if (dragItem.id === belowItem.id) return;

    //看below item是否是在某个group里，如果是，那么要拒绝新的group添加到它旁边
    const belowInRoot = layout.findIndex((el) => el.id === belowItem.id) !== -1;
    if (!belowInRoot && dragItem.type === COMP_NAMES.GROUP) return;

    //先验证组件id是否存在，因为添加组件过程在hover事件中进行，因而会重复触发
    let newLayout = [...layout];
    const dragItemExist = findGroupIndex(dragItem, newLayout);
    if (dragItemExist) return;

    const result = findGroupIndex(belowItem, newLayout);

    //
    //
    //dragItem.inDragProcess = true;
    //
    //
    result.group.splice(result.index, 0, dragItem);
    setLayout(newLayout);
  };

  const copy = ({ id }) => {
    //复制comp
    let newLayout = [...layout];
    const result = findGroupIndex({ id }, newLayout);
    //let copyed = { ...result.group[result.index] };
    let copyed = JSON.parse(JSON.stringify(result.group[result.index]));
    copyed.id = `${copyed.type}-${uid(16)}`;
    //copyed.attrs.compId = uid(16);
    if (copyed.children) {
      copyed.children = copyed.children.map((el) => ({
        ...el,
        id: `${el.type}-${uid(16)}`,
        attrs: {
          ...el.attrs,
          //compId: uid(16)
        },
      }));
    }

    result.group.splice(result.index + 1, 0, copyed);
    setLayout(newLayout);
  };

  const remove = (item) => {
    //移除comp
    let newLayout = [...layout];
    const result = findGroupIndex(item, newLayout);
    result.group.splice(result.index, 1);
    setLayout(newLayout);
  };

  const addToGroup = (dragItem, belowGroup) => {
    //ui组件不能拖进子表单group里，但是可以拖进分组section里
    if (dragItem.category === CATEGORY.UI && belowGroup.type === 'GROUP')
      return;

    //组件id一样，说明拖到自己头上，直接return
    if (dragItem.id === belowGroup.id) return;

    //如果是不支持子表单显示的组件也不让拖进来
    if (unsupportInGroup(dragItem)) return;

    let newLayout = [...layout];
    const result = findGroupIndex(belowGroup, newLayout);
    const belowGroupData = result.group[result.index];

    //
    //dragItem.inDragProcess = true;
    //

    if (
      dragItem.type !== COMP_NAMES.GROUP &&
      dragItem.type !== COMP_NAMES.SECTION
    ) {
      //先要判断一下below group 是否已经有children，有的话就不操作了，添加操作让group里的children处理
      if (belowGroupData?.children?.length > 0) return;

      //判断dragitem 是否已存在于layout，是的话将其从layout移除加入group，否则就说明是左边列表拖过来的，直接在group中添加第一个item
      const dragItemData = findGroupIndex(dragItem, newLayout);
      if (dragItemData) {
        const existDragItem = dragItemData.group[dragItemData.index];

        belowGroupData.children = [existDragItem];
        dragItemData.group.splice(dragItemData.index, 1);
      } else {
        belowGroupData.children = [dragItem];
      }
    } else {
      newLayout.splice(result.index, 0, dragItem);
    }
    setLayout(newLayout);
  };

  const swapGroup = (dragGroup, belowGroup) => {
    if (dragGroup.id === belowGroup.id) return;
    const newLayout = [...layout];
    const dragResult = findGroupIndex(dragGroup, newLayout);
    const belowResult = findGroupIndex(belowGroup, newLayout);
    if (!dragResult || !belowResult) return;

    const sourceIndex = dragResult.index;
    const targetIndex = belowResult.index;

    const dragData = dragResult.group[sourceIndex];

    //
    //dragData.inDragProcess = true;
    //
    dragResult.group.splice(sourceIndex, 1);
    belowResult.group.splice(targetIndex, 0, dragData);

    setLayout(newLayout);
  };

  //由于都在hover事件触发layout重渲染，需要throttle。并且组件添加逻辑分别被一般item和group分别处理，因而需要两个update方法
  const updateLayoutByItem = (drag, below) => {
    //该update方法below必为一般item不是group
    //ui组件不能拖进group，section可以拖进ui组件
    const blowComp = findGroupIndex(below, layout);
    if (drag.category === CATEGORY.UI && blowComp.groupType === 'GROUP') {
      return;
    }

    const isExistComp = findGroupIndex(drag, layout);

    if (isExistComp) {
      swap(drag, below);
    } else {
      add(drag, below);
    }
  };

  const updateLayoutByGroup = (drag, below) => {
    //该update方法below必为group
    //ui组件不能拖进group 但可以拖进section

    const isExistComp = findGroupIndex(drag, layout);

    if (isExistComp) {
      if (drag.type === COMP_NAMES.GROUP || drag.type === COMP_NAMES.SECTION) {
        swapGroup(drag, below);
      } else {
        addToGroup(drag, below);
      }
    } else {
      addToGroup(drag, below);
    }
  };

  const getGroupData = (groupItem) => {
    const exist = findGroupIndex(groupItem, layout);
    return exist?.group[exist.index];
  };

  const isRootComp = (compId, provideLayout = layout) => {
    //检查comp是否在根布局中，主要用在往table layout拖拽时不让group 内得comp落下，group要作为一个整体
    return provideLayout.findIndex((el) => el.id === compId) !== -1;
  };

  const isCompInGroup = (compId, provideLayout = layout) => {
    const groups = provideLayout.filter((el) => el.name === COMP_NAMES.GROUP);
    let exist = false;
    for (let i = 0, l = groups.length; i < l; i++) {
      if (groups[i].children.findIndex((el) => el.id === compId) !== -1) {
        exist = true;
        break;
      }
    }
    return exist;
  };

  const updateLayoutByRoot = (drag) => {
    const newLayout = [...layout];
    const exist = findGroupIndex(drag, newLayout);
    if (!exist) {
      newLayout.push(drag);
      setLayout(newLayout);
    } else {
      //拖动已存在layout中的组件到空白处，执行交换位置操作
      const dragData = exist.group[exist.index];
      exist.group.splice(exist.index, 1);
      newLayout.push(dragData);
      setLayout(newLayout);
    }
  };

  const restoreDefault = () => {
    setLayout([]);
  };

  const updateAttrs = (compId, newAttrs) => {
    const newLayout = [...layout];
    const exist = findGroupIndex({ id: compId }, newLayout);
    const prevAttrs = exist.group[exist.index].attrs;
    exist.group[exist.index].attrs = { ...prevAttrs, ...newAttrs };
    setLayout(newLayout);
  };

  const validate = (provideLayout = layout) => {
    if (!provideLayout?.length > 0) {
      //布局不能为空
      return;
    }
    let errorComps = [];
    function validate(arr) {
      arr.map((comp) => {
        if (comp.category === CATEGORY.INTERACT) {
          if (!comp.attrs?.label) {
            //label不能为空
            errorComps.push(comp);
          }

          // if (comp.type === COMP_NAMES.UPLOAD) {
          //   //上传组件下载模板打开时，链接地址名称必填
          //   if (comp.attrs.hasTemplate) {
          //     if (!(comp.attrs.templateSrc && comp.attrs.templateName)) {
          //       errorComps.push(comp);
          //     }
          //   }
          // }
        }

        if (comp.category === CATEGORY.LAYOUT) {
          if (comp.name === COMP_NAMES.GROUP) {
            if (!(comp?.children?.length > 0)) {
              errorComps.push(comp);
            } else {
              validate(comp.children);
            }
          }
        }
      });
    }

    validate(provideLayout);
    setErrorPool(errorComps);
    return errorComps.length === 0;
  };

  const endDragAction = () => {
    const result = findDraggingComp(layout);
    if (result) {
      delete result.inDragProcess;
      setLayout([...layout]);
    }
  };

  const startDragAction = (dragData) => {
    const result = findDraggingComp(layout);
    if (result) {
      delete result.inDragProcess;
      setLayout([...layout]);
    }
  };

  const hasError = (compId) => {
    return errorPool.find((el) => el.id === compId);
  };

  return {
    activeItem,
    setActiveItem,

    layout,
    setLayout,
    restoreDefault,
    remove,
    getGroupData,
    updateAttrs,
    copy,

    updateLayoutByItem: useThrottle(updateLayoutByItem, 200, [layout]),
    updateLayoutByGroup: useThrottle(updateLayoutByGroup, 200, [layout]),
    updateLayoutByRoot: useThrottle(updateLayoutByRoot, 200, [layout]),

    validate,
    hasError,
    isRootComp,
    isCompInGroup,

    endDragAction: useThrottle(endDragAction, 100, [layout]),
  };
};

export default useFormLayout;
