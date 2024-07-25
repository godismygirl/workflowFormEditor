import dayjs from 'dayjs';
import ActionProvider from '../ActionProvider';
import styles from './styles.less';

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
      <div className={styles.datePickerContent}>
        {dayjs().format(attrs.showTimeFormat)}
      </div>
    </ActionProvider>
  );
};

export default H5DatePicker;
