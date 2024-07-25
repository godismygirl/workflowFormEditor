import { useState, useEffect } from 'react';
import { useModel, useLocation } from 'umi';
import { parse } from 'query-string';
import { TAB_KEY } from '@/pages/Editor';

const defaultStatus = {
  [TAB_KEY.BASIC]: 'process',
  [TAB_KEY.FORM]: 'process',
  [TAB_KEY.WORKFLOW]: 'process',
  [TAB_KEY.COLUMN]: 'process',
  [TAB_KEY.PRINT]: 'process',
  [TAB_KEY.CONFIG]: 'process',
};

const defatultResult = {
  [TAB_KEY.BASIC]: null,
  [TAB_KEY.FORM]: null,
  [TAB_KEY.WORKFLOW]: null,
  [TAB_KEY.COLUMN]: null,
  [TAB_KEY.PRINT]: null,
  [TAB_KEY.CONFIG]: null,
};

const useSaveProgress = () => {
  const [open, setOpen] = useState(false);
  const [validateStatus, setValidateStatus] = useState({ ...defaultStatus });
  const [validatePass, setValidatePass] = useState(false);
  const [result, setResult] = useState({ ...defatultResult });
  // const { search } = useLocation();
  // const query = parse(search);

  //
  const { clearConfig } = useModel('useColumnDesign');
  const { removeConfig } = useModel('useWorkflow');

  const startSave = () => {
    setOpen(true);
  };

  const endSave = () => {
    setOpen(false);
  };

  const checkPass = (ob) => {
    let hasError = false;
    //hash路由取不到window.location.search，所以自己截取
    const queryIndex = window.location.href.indexOf('?');
    const search = window.location.href.slice(queryIndex);

    const query = parse(search);
    if (!query.hasWorkflow) {
      hasError =
        ob[TAB_KEY.BASIC] !== 'finish' ||
        ob[TAB_KEY.FORM] !== 'finish' ||
        ob[TAB_KEY.COLUMN] !== 'finish' ||
        ob[TAB_KEY.PRINT] !== 'finish';
    } else {
      hasError = Object.keys(ob).find((key) => ob[key] !== 'finish');
    }

    setValidatePass(!hasError);
  };

  const updateStatus = (ns) => {
    if (!ns) return;

    Object.keys(ns).map((key) => (validateStatus[key] = ns[key]));
    checkPass(validateStatus);

    setValidateStatus({ ...validateStatus });
  };

  const updateResult = (ns) => {
    if (!ns) return;
    Object.keys(ns).map((key) => (result[key] = ns[key]));
    setResult({ ...result });
  };

  const clearStatus = () => {
    setValidateStatus({ ...defaultStatus });
  };

  const clearResult = () => {
    setResult({ ...defatultResult });
    updateResult({});
  };

  //删除formlayout中的组件触发
  const resetByFormLayoutChange = (cmpId, changeProcess) => {
    //清除columnDesign, printDesign, basicInfo里的关键信息自定义（如果有）
    //removeConfig
    clearConfig();
    if (result?.[TAB_KEY.BASIC]?.tagFieldId === cmpId) {
      updateResult({
        [TAB_KEY.BASIC]: { ...result[TAB_KEY.BASIC], tagFieldId: undefined },
      });
    }

    if (changeProcess) {
      const p = removeConfig(cmpId);
      updateResult({
        [TAB_KEY.WORKFLOW]: p,
      });
    }

    updateResult({
      [TAB_KEY.COLUMN]: null,
      [TAB_KEY.PRINT]: null,
    });

    updateStatus({
      [TAB_KEY.COLUMN]: 'process',
      [TAB_KEY.PRINT]: 'process',
    });
  };

  return {
    open,
    startSave,
    endSave,
    validateStatus,
    updateStatus,
    updateResult,
    clearStatus,
    clearResult,
    validatePass,
    result,
    resetByFormLayoutChange,
  };
};

export default useSaveProgress;
