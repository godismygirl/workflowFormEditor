import ActionProvider from '../ActionProvider';

const Section = ({
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

export default Section;
