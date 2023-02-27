import { cloneDeep, get, set } from "lodash";

export const coerceDate = (obj: any, deepAttributes: string[]) => {
  const result = cloneDeep(obj);
  deepAttributes.forEach((deepAttribute) => {
    const dateString = get(obj, deepAttribute);
    if (dateString) {
      set(result, deepAttribute, new Date(dateString));
    }
  });
  return result;
};
