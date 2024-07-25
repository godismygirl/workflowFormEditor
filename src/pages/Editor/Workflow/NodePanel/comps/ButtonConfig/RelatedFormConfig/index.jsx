import { createStore } from 'hox';
import layoutStore from '@/models/useFormLayout';
import { useStore, StoreProvider } from './formStore';
import Inner from './Inner';

const RelatedFormConfig = ({ value, onChange }) => {
  return (
    <StoreProvider>
      <Inner value={value} onChange={onChange} />
    </StoreProvider>
  );
};

export default RelatedFormConfig;
