import {
  Input as VantInput,
  Slider,
  Checkbox as VantCheckbox,
  Divider as VantDivider,
} from 'react-vant';
import Radio from './Radio';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';
import ImagePicker from './ImagePicker';
import Upload from './Upload';

import DepartPicker from './DepartPicker';
import EmployeePicker from './EmployeePicker';
import OrgPicker from './OrgPicker';
import PostPicker from './PostPicker';
import WorkPermitInput from './WorkPermitInput';
import ServiceProvider from './ServiceProvider';
import ClosableImagePicker from './ClosableImagePicker';

const InputNumber = (props) => {
  return (
    <VantInput
      type="digit"
      {...props}
      placeholder={props.readOnly ? '' : props?.placeholder}
    />
  );
};

const Input = (props) => {
  return (
    <VantInput
      {...props}
      placeholder={props.readOnly ? '' : props?.placeholder}
    />
  );
};

const TextArea = (props) => {
  return (
    <VantInput.TextArea
      {...props}
      placeholder={props.readOnly ? '' : props?.placeholder}
    />
  );
};

const Checkbox = ({
  options,
  shape,
  direction,
  readOnly,
  onChange,
  ...rest
}) => {
  //debugger;
  return (
    <VantCheckbox.Group
      direction={direction}
      onChange={(v) => {
        if (readOnly) return;
        onChange?.(v);
      }}
      {...rest}
    >
      {options?.map((el, i) => (
        <VantCheckbox key={i} name={el.value} shape={shape}>
          {el.label}
        </VantCheckbox>
      ))}
    </VantCheckbox.Group>
  );
};

const Divider = ({ contentPosition, value }) => {
  return <VantDivider contentPosition={contentPosition}>{value}</VantDivider>;
};

const Title = ({ value, fontSize, textAlign }) => {
  return (
    <div
      style={{
        padding: '15px 15px 8px 15px',
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign,
        fontSize,
      }}
    >
      {value}
    </div>
  );
};

const Text = ({ value, fontSize }) => {
  return <div style={{ padding: '15px 15px 8px 15px', fontSize }}>{value}</div>;
};

export {
  Input,
  TextArea,
  Slider,
  DatePicker,
  TimePicker,
  InputNumber,
  Radio,
  Checkbox,
  ImagePicker,
  Upload,
  Divider,
  Title,
  Text,
  DepartPicker,
  EmployeePicker,
  OrgPicker,
  PostPicker,
  WorkPermitInput,
  ServiceProvider,
  ClosableImagePicker,
};
