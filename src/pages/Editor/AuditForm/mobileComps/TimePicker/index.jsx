import dayjs from 'dayjs';
import ActionProvider from '../ActionProvider';
import styles from './styles.less';

const time = dayjs().format('HH : mm : ss');

const H5DatePicker = ({
  id,
  type,
  category,
  attrs,
  inDragProcess,
  ActionProvider,
}) => {
  return (
    <ActionProvider
      id={id}
      type={type}
      category={category}
      attrs={attrs}
      inDragProcess={inDragProcess}
    >
      <div className={styles.datePickerContent}>{time}</div>
    </ActionProvider>
  );
};

export default H5DatePicker;
