import { useState } from 'react';
import {
  Input,
  Slider,
  TimePicker as AntTimePicker,
  InputNumber,
  Select,
  Checkbox as AntCheckbox,
  DatePicker as AntDatePicker,
  Divider as AntDivider,
  Space,
} from 'antd';
import 'dayjs/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import dayjs from 'dayjs';
import ImagePicker from './ImagePicker';
import Upload from './Upload';
import EmployeePicker from '@/comps/EmployeePicker';
import DepartPicker from '@/comps/DepartPicker';
import OrgPicker from '@/comps/OrgPicker';
import PostPicker from '@/comps/PostPicker';
import WorkPermitInput from './WorkPermitInput';
import ServiceProvider from './ServiceProvider';
import ClosableImagePicker from './ClosableImagePicker';
import Radio from './Radio';

const TextArea = Input.TextArea;

const Checkbox = ({ options, direction, readOnly, onChange, ...rest }) => {
  return (
    <AntCheckbox.Group
      onChange={(v) => {
        if (readOnly) return;
        onChange?.(v);
      }}
      {...rest}
    >
      <Space direction={direction}>
        {options.map((el, index) => {
          return (
            <div key={index}>
              <AntCheckbox value={el.value}>{el.label}</AntCheckbox>
              {/* {el.desc && (
            <div className={styles.descRow}>
              <Input placeholder="备注" />
            </div>
          )} */}
            </div>
          );
        })}
      </Space>
    </AntCheckbox.Group>
  );
};

const DatePicker = ({ value, onChange, showTimeFormat, readOnly, ...rest }) => {
  const [open, setOpen] = useState(false);

  const onDateChange = (val) => {
    if (readOnly) return;
    if (!val) {
      onChange?.();
      return;
    }

    const formated = dayjs(val).format('YYYY-MM-DD HH:mm:ss');
    onChange?.(formated);
  };

  return (
    <AntDatePicker
      locale={locale}
      value={value ? dayjs(value) : undefined}
      onChange={onDateChange}
      showTime={
        !showTimeFormat || showTimeFormat === 'YYYY-MM-DD'
          ? false
          : { format: showTimeFormat }
      }
      format={showTimeFormat}
      inputReadOnly
      open={!readOnly && open}
      onOpenChange={(o) => setOpen(o)}
      {...rest}
    />
  );
};

const TimePicker = ({ value, onChange, ...rest }) => {
  const onTimeChange = (val) => {
    const formated = dayjs(val).format('YYYY-MM-DD HH:mm:ss');
    onChange(formated);
  };

  return (
    <AntTimePicker
      locale={locale}
      value={value ? dayjs(value) : value}
      onChange={onTimeChange}
      {...rest}
    />
  );
};

const Title = ({ value, fontSize, textAlign }) => {
  return <div style={{ fontWeight: 'bold', fontSize, textAlign }}>{value}</div>;
};

const Text = ({ value, fontSize }) => {
  return <div style={{ fontSize }}>{value}</div>;
};

const Divider = ({ value, ...rest }) => {
  return (
    <AntDivider plain {...rest}>
      {value}
    </AntDivider>
  );
};

export {
  Input,
  TextArea,
  Slider,
  DatePicker,
  TimePicker,
  InputNumber,
  Select,
  Radio,
  Checkbox,
  ImagePicker,
  Upload,
  Divider,
  Title,
  Text,
  EmployeePicker,
  DepartPicker,
  OrgPicker,
  PostPicker,
  WorkPermitInput,
  ServiceProvider,
  ClosableImagePicker,
};
