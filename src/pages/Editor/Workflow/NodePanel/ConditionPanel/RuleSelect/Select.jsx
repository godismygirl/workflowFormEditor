import { Select } from 'antd';

const RuleSelect = ({ value, onChange, ...rest }) => {
  return (
    <Select value={value?.[0]} onChange={(v) => onChange([v])} {...rest} />
  );
};

export default RuleSelect;
