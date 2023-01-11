import { Random } from '@core/test/random';

export const mockBaseEntity = {
  id: Random.id,
  createdAt: Random.datePast,
  updatedAt: Random.datePast,
  isArchived: false,
};
