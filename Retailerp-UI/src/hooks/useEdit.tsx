import { getCurrentFieldValue, isEmpty } from '@utils/form-util';
import { useState } from 'react';

export const useEdit = (initial: any) => {
  const [edits, setEdits] = useState<any>({});

  const reset = () => {
    setEdits({});
  };

  const update = (values: any) => {
    setEdits({ ...edits, ...values });
  };

  const allFilled = (...properties: any[]) => {
    return !properties.some((r) => !getValue(r));
  };

  const getValue = (field: any) => {
    return getCurrentFieldValue(initial, edits, field);
  };

  const isAnyModified = () => {
    return !isEmpty(edits);
  };

  return { reset, update, getValue, allFilled, edits, isAnyModified };
};
