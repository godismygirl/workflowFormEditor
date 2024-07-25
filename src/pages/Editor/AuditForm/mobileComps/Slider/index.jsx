import ActionProvider from '../ActionProvider';
import { Slider as AntSlider } from 'antd';

function formatter(value) {
  return `${value}%`;
}

const Slider = ({
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
      <AntSlider
        min={attrs.min}
        max={attrs.max}
        value={attrs.value}
        step={attrs.step}
        //tooltip={{ formatter: attrs.percent ? formatter : () => {} }}
      />
    </ActionProvider>
  );
};

export default Slider;
