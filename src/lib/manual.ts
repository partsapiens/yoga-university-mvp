import manual from '@/data/manual.json';
import { Manual } from '@/types';

export const getManualContent = (): Manual => {
  return manual as Manual;
};
