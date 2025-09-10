import { useSavedFlows } from './useSavedFlows';
import type { SavedFlow } from '@/types/yoga';

export function useApplyToFlow() {
  const { saved, setSaved } = useSavedFlows(true);

  const applyToFlow = (flow: SavedFlow) => {
    setSaved([...saved, flow]);
  };

  return { applyToFlow };
}
