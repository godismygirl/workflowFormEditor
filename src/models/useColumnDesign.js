import { useState, useEffect } from 'react';
import { useModel } from 'umi';
import { arrayMove } from '@dnd-kit/sortable';
import { COMP_NAMES } from '@/pages/Editor/AuditForm/consts';

const AVAILABLE_COMP_TYPES = [
  COMP_NAMES.INPUT,
  COMP_NAMES.TEXT_AREA,
  COMP_NAMES.INPUT_NUMBER,
  COMP_NAMES.DATE_PICKER,
  COMP_NAMES.TIME_PICKER,
  COMP_NAMES.RADIO,
  COMP_NAMES.CHECKBOX,
  COMP_NAMES.EMPLOYEE_PICKER,
  COMP_NAMES.DEPART_PICKER,
  COMP_NAMES.ORG_PICKER,
];

const available = (type) => {
  return AVAILABLE_COMP_TYPES.includes(type);
};

const useColumnDesign = () => {
  //const { layout } = useModel('useFormLayout');

  const [searchCondition, setSearchCondition] = useState([]);
  const [tableHeadConfig, setTableHeadConfig] = useState([]);

  // const getInitalEnabled = (id, data) => {
  //   if (!data) return true;
  //   const target = data?.find((el) => el.id === id);
  //   return !!target?.enabled;
  // };

  const initConfig = (data) => {
    if (searchCondition?.length > 0 || tableHeadConfig?.length > 0) {
      return;
    }
    const initialSearch = data?.filterableFields;
    const initialTable = data?.displayableFields;
    if (initialSearch?.length > 0) setSearchCondition(initialSearch);
    if (initialTable?.length > 0) setTableHeadConfig(initialTable);
  };

  const clearConfig = () => {
    setSearchCondition([]);
    setTableHeadConfig([]);
  };

  const updateConfig = (layoutData) => {
    let avaPool = [];
    let searchResult = [];
    let tableResult = [];

    layoutData?.map((el) => {
      if (el.type === COMP_NAMES.SECTION) {
        el.children?.map((c) => {
          if (available(c.type)) {
            avaPool.push(c);
          }
        });
      } else {
        if (available(el.type)) {
          avaPool.push(el);
        }
      }
    });

    searchResult = avaPool?.map((el) => {
      const exist = searchCondition?.find((s) => s.id === el.id);
      return {
        ...el,
        enabled: exist?.enabled ?? true,
      };
    });

    tableResult = avaPool?.map((el) => {
      const exist = tableHeadConfig?.find((s) => s.id === el.id);
      return {
        ...el,
        enabled: exist?.enabled ?? true,
      };
    });

    setSearchCondition(searchResult);
    setTableHeadConfig(tableResult);
  };

  const toggeSearchOnOff = ({ id, enabled }) => {
    const after = searchCondition?.map((el) => {
      if (el.id === id) {
        return { ...el, enabled };
      }
      return el;
    });

    setSearchCondition(after);
  };

  const toggeTableHeadOnOff = ({ id, enabled }) => {
    const after = tableHeadConfig?.map((el) => {
      if (el.id === id) {
        return { ...el, enabled };
      }
      return el;
    });

    setTableHeadConfig(after);
  };

  const updateSearchIndex = (event) => {
    const { active, over } = event;
    //debugger;
    if (active.id !== over.id) {
      setSearchCondition((items) => {
        const oldIndex = items.findIndex((el) => el.id === active.id);
        const newIndex = items.findIndex((el) => el.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const updateTableHeadIndex = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setTableHeadConfig((items) => {
        const oldIndex = items.findIndex((el) => el.id === active.id);
        const newIndex = items.findIndex((el) => el.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return {
    searchCondition,
    tableHeadConfig,
    initConfig,
    updateConfig,
    clearConfig,
    toggeSearchOnOff,
    toggeTableHeadOnOff,
    updateSearchIndex,
    updateTableHeadIndex,
  };
};

export default useColumnDesign;
