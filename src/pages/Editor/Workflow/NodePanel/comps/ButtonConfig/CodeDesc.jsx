import React from 'react';

const CodeDesc = ({ value, onChange, descMap }) => {
  const getDesc = (code) => {
    const target = descMap?.find((el) => el.code === code);
    return target?.desc;
  };

  return <span>{getDesc(value)}</span>;
};

export default CodeDesc;
