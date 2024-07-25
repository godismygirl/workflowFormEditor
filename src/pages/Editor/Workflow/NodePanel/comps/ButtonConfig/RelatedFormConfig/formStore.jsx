import { createStore } from 'hox';
import layoutStore from '@/models/useFormLayout';

export const [useStore, StoreProvider] = createStore(layoutStore);
