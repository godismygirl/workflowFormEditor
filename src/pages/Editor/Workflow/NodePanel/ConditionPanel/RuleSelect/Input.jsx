import { Input } from 'antd';

const RuleInput = ({ value, onChange, ...rest }) => {
  return (
    <Input
      value={value?.[0]}
      onChange={(e) => onChange([e.target.value])}
      {...rest}
    />
  );
};

export default RuleInput;
