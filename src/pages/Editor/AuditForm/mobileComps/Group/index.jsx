import ActionProvider from '../ActionProvider';

const Group = ({
  id,
  type,
  category,
  attrs,
  inDragProcess,
  ActionProvider,
  children,
}) => {
  return (
    <ActionProvider
      id={id}
      type={type}
      category={category}
      attrs={attrs}
      inDragProcess={inDragProcess}
      groupBox
    >
      {children}
    </ActionProvider>
  );
};

export default Group;
