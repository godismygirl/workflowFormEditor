import React from 'react';
import { useDrop } from 'react-dnd';
import { Empty } from 'antd';
import * as Comps from '@/pages/Editor/AuditForm/mobileComps';
import ActionProvider from '../ActionProvider';
import { COMP_NAMES, COMP_NAMES_MAP } from '@/pages/Editor/AuditForm/consts';
import { useStore } from '../formStore';
import styles from './styles.less';

const ActionCanvas = ({ editable = true }) => {
  const { layout, updateLayoutByRoot } = useStore();

  const [{ canDrop, isOverRoot }, drop] = useDrop(
    () => ({
      accept: 'DRAGABLE_COMP',
      hover: (item, monitor) => {
        monitor.isOver({ shallow: true }) && updateLayoutByRoot(item);
      },
      collect: (monitor) => ({
        isOverRoot: monitor.isOver({ shallow: true }),
        canDrop: monitor.canDrop(),
      }),
    }),
    [layout],
  );

  const renderLayout = (arr) => {
    return arr.map((item) => {
      if (item.type === COMP_NAMES.GROUP) {
        const Box = Comps[COMP_NAMES_MAP[COMP_NAMES.GROUP]];
        return (
          <Box key={item.id} editable={editable} {...item}>
            {item?.children?.length > 0 && renderLayout(item.children)}
          </Box>
        );
      }

      if (item.type === COMP_NAMES.SECTION) {
        const Box = Comps[COMP_NAMES_MAP[COMP_NAMES.SECTION]];

        return (
          <Box key={item.id} editable={editable} {...item}>
            {item?.children?.length > 0 && renderLayout(item.children)}
          </Box>
        );
      }

      const Component = Comps[COMP_NAMES_MAP[item.type]];
      return (
        <Component
          key={item.id}
          editable={editable}
          {...item}
          ActionProvider={ActionProvider}
        />
      );
    });
  };

  return (
    <div className={styles.outline}>
      <div ref={drop} className={styles.canvas}>
        {layout?.length === 0 && (
          <div className={styles.empty}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="请拖拽左侧组件创建表单"
            />
          </div>
        )}
        {renderLayout(layout)}
      </div>
    </div>
  );
};

export default React.memo(ActionCanvas);
