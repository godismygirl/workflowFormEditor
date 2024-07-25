import React, { useState, useMemo } from 'react';
import { Select } from 'antd';
import { COMP_NAMES } from '@/pages/Editor/AuditForm/consts';

const EquationTypeSelect = (type) => {
  const equalOptions = [{ label: '等于', value: 'EQUAL' }];
  const allOpitions = [
    { label: '等于', value: 'EQUAL' },
    { label: '小于', value: 'LOWER_THAN' },
    { label: '小于等于', value: 'LOWER_THAN_OR_EQUALS' },
    { label: '大于', value: 'GREATER_THAN' },
    { label: '大于等于', value: 'GREATER_THAN_OR_EQUALS' },
  ];

  const equalTypes = [
    COMP_NAMES.INPUT,
    COMP_NAMES.TEXT_AREA,
    COMP_NAMES.SELECT,
    COMP_NAMES.RADIO,
    COMP_NAMES.CHECKBOX,
    COMP_NAMES.IMAGE_PICKER,
  ];
  const allTypes = [
    COMP_NAMES.TIME_PICKER,
    COMP_NAMES.INPUT_NUMBER,
    COMP_NAMES.SLIDER,
  ];

  const options = useMemo(() => {
    if (allTypes.includes(type)) {
      return allOpitions;
    }

    if (equalTypes.includes(type)) {
      return equalOptions;
    }

    return [];
  }, [type]);

  return <Select options={options} />;
};

export default EquationTypeSelect;
