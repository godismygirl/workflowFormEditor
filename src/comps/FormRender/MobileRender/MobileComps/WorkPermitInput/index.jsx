import { Input } from 'react-vant';

const WorkPermitInput = ({ value, onChange, ...rest }) => {
  const { search } = useLocation();
  const query = parse(search);

  useEffect(() => {
    if (query.WORK_PERMIT_CODE) {
      onChange?.(query.WORK_PERMIT_CODE);
    }
  }, []);

  return <Input value={value} onChange={onChange} {...rest} />;
};

export default WorkPermitInput;
