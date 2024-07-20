import { values } from 'ramda';

// Validate or invalidate cache by tags after a mutation
export const RTKTags = {
  GetProducts: 'GetProducts',
};

export const RTKTagsAsArray = () => values(RTKTags);
