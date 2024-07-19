import { values } from "ramda";

// Validate or invalidate cache by tags after a mutation
export const RTKTags = {
  GetProducts: "GetProducts",
};

export const RTKTagsAsArray = () => values(RTKTags);

export const apiExtractError = <T extends Record<string, any>>(
  error: unknown,
  key: keyof T
): string => {
  const err = error as {
    status: number;
    data: T;
  };

  return err.data[key] as string;
};
