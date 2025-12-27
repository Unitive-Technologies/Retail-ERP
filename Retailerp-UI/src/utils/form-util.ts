import {
  AND_SEPARATOR,
  ASSIGNMENT_SEPARATOR,
  OR_SEPARATOR,
} from '@constants/Constance';

// export const getCurrentFieldValue = (
//   initialVal: string,
//   edits: any,
//   fieldName: any
// ) => {
//   if (edits[fieldName] !== undefined) {
//     return edits[fieldName];
//   }
//   if (initialVal) {
//     return initialVal[fieldName];
//   }
//   return null;
// };

export const getCurrentFieldValue = (
  initialVal: any,
  edits: any,
  fieldName: string
) => {
  const getNestedValue = (obj: any, path: string) => {
    if (!obj || typeof path !== 'string') return undefined;
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
  };

  // 1) Prefer flat dotted key in edits (since updates like handleValidatedChange write this)
  if (edits && Object.prototype.hasOwnProperty.call(edits, fieldName)) {
    return edits[fieldName];
  }

  // 2) Then try nested read from edits
  const nestedFromEdits = getNestedValue(edits, fieldName);
  if (nestedFromEdits !== undefined) return nestedFromEdits;

  // 3) Fallback to initial: flat key, then nested
  if (initialVal) {
    if (Object.prototype.hasOwnProperty.call(initialVal, fieldName)) {
      return initialVal[fieldName];
    }
    const nestedFromInitial = getNestedValue(initialVal, fieldName);
    if (nestedFromInitial !== undefined) return nestedFromInitial;
  }

  return null;
};
export const isEmpty = (obj: string | never[]) => {
  if (typeof obj === 'object') {
    for (const prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        return false;
      }
    }
    return JSON.stringify(obj) === JSON.stringify({});
  }
  return Array.isArray(obj) && obj.length === 0;
};

export const createAndFields = (fieldValuesPair: any[]) => {
  return fieldValuesPair
    .map((e) => {
      if (Array.isArray(e.value)) {
        return `${e.columnField}${ASSIGNMENT_SEPARATOR}${e.value.join(
          OR_SEPARATOR
        )}`;
      }
      return `${e.columnField}${ASSIGNMENT_SEPARATOR}${e.value}`;
    })
    .join(AND_SEPARATOR);
};

export const oldQueryMethod = (
  filters: { [s: string]: unknown } | ArrayLike<unknown>
) => {
  const pairs = Object.entries(filters)
    .filter(([, value]) => value !== undefined)
    .map(([columnField, value]) => {
      return { columnField, value };
    });
  const query = createAndFields(pairs);
  return query;
};

export const getToken = (): string | null => {
  const token = localStorage.getItem('token');
  try {
    return token ? JSON.parse(token) : null; // Return null if token is not found
  } catch {
    return null; // Handle parsing error
  }
};

export const getUserId = () => {
  const userId = localStorage.getItem('userId'); // Get userId from localStorage
  if (!userId) {
    return null; // Return null if userId is not found
  }
  try {
    return JSON.parse(userId); // Parse and return the userId
  } catch (error) {
    console.error('Failed to parse userId:', error); // Log error for debugging
    return null; // Return null if parsing fails
  }
};

export const getLoginType = () => {
  const loginType = localStorage.getItem('login_type'); // Get login_type from localStorage
  if (!loginType) {
    return null; // Return null if login_type is not found
  }
  try {
    return JSON.parse(loginType); // Parse and return the login_type
  } catch (error) {
    console.error('Failed to parse userType:', error); // Log error for debugging
    return null; // Return null if parsing fails
  }
};

export const capitalizeFirstLetter = (str: string) => {
  return str?.charAt(0)?.toUpperCase() + str?.slice(1);
};

export const isValidURL = (value: string | URL) => {
  try {
    const url = new URL(value);
    if (url.protocol === 'blob:' || url.hostname === 'localhost') {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

export const isValidEmail = (email: any) => {
  const emailExp =
    /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
  return email?.match(emailExp);
};

export const isValidGSTIN = (val: string) => {
  const v = (val || '').trim().toUpperCase();
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/.test(v);
};
export const isValidIFSC = (val: string) =>
  /^[A-Z]{4}0[A-Z0-9]{6}$/.test((val || '').trim());

export const isPhoneNumber = (number: any) => {
  const numberExp = /^([0-9()-]{10})$/;
  return number?.match(numberExp);
};

export const isValidPAN = (val: string) => {
  const v = (val || '').trim().toUpperCase();
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v);
};

export const isValidAadhaar = (val: string) => {
  const v = (val || '').trim();
  return /^[2-9][0-9]{11}$/.test(v);
};

export const onlyString = (string: any) => {
  const strExp = /^[a-zA-Z\s]*$/;
  return strExp.test(string);
};
export const isLettersAndNumbersOnly = (value: string) => {
  return /^[a-zA-Z0-9]*$/.test(value);
};

export const trimSpacesBeforeFirstLetter = (input: string) => {
  return input.trimStart();
};

export const isValidPinCode = (number: string) => {
  const pinCodeExp = /^[1-9][0-9]{5}$/;
  return number?.match(pinCodeExp);
};

export const isAlphaNumeric = (input: string) => {
  const regExp = /^[a-zA-Z0-9]+$/;
  return regExp.test(input);
};

export const isAlphaNumericWithSpace = (input: string) => {
  // Allow empty string during typing (use *), still restrict to letters/numbers/spaces
  const regExp = /^[a-zA-Z0-9\s/&]*$/;
  return regExp.test(input);
};

export const isAlphaNumericWithSpaceAndSlash = (input: string) => {
  // Allow letters, numbers, spaces, and '/'. Empty allowed during typing
  const regExp = /^[a-zA-Z0-9\s/]*$/;
  return regExp.test(input);
};

export const isValidPassword = (password: string) => {
  const passwordExp = /^.{6,}$/; // At least 6 characters
  return password?.match(passwordExp);
};

export const formatDate = (date: string | number | Date) => {
  const data = new Date(date);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(data);
};

export const allowDecimalOnly = (value: string) => {
  return /^\d*\.?\d*$/.test(value);
};

export const isNoSpace = (value: string): boolean => {
  const noLeadingSpaceExp = /^(?!\s).*$/; // disallow leading space
  return noLeadingSpaceExp.test(value);
};
export const isAlphaNumericWithQuotesAndSlash = (input: string) => {
  // Allow letters, numbers, spaces, '/', single quote ('), double quote ("), and dot (.)
  const regExp = /^[a-zA-Z0-9\s/'".]*$/;
  return regExp.test(input);
};

export const handleValidatedChange = (
  e: any,
  edit: any,
  fieldName: string,
  type:
    | 'string'
    | 'number'
    | 'email'
    | 'pincode'
    | 'alphanumeric'
    | 'alphanumericWithSpace'
    | 'alphanumericWithSpaceAndSlash'
    | 'alphaNumericWithQuotesAndSlash'
    | 'noSpace'
) => {
  const value = e.target.value;

  switch (type) {
    case 'string':
      if (!onlyString(value)) return;
      break;

    case 'number':
      if (isNaN(Number(value))) return;
      if (value.length > 10) return;
      break;

    case 'email': {
      const emailPartialExp = /^[a-zA-Z0-9@._-]*$/;
      if (!emailPartialExp.test(value)) return;
      break;
    }
    case 'pincode': {
      const pinPartialExp = /^[0-9]*$/;
      if (!pinPartialExp.test(value)) return;
      if (value.length > 6) return;
      break;
    }

    case 'alphanumeric':
      if (!isLettersAndNumbersOnly(value)) return;
      break;

    case 'alphanumericWithSpace':
      if (!isAlphaNumericWithSpace(value)) return;
      break;

    case 'alphanumericWithSpaceAndSlash':
      if (!isAlphaNumericWithSpaceAndSlash(value)) return;
      break;
    case 'alphaNumericWithQuotesAndSlash':
      if (!isAlphaNumericWithQuotesAndSlash(value)) return;
      break;
    case 'noSpace': {
      const noLeadingSpaceExp = /^(?!\s).*$/;
      if (!noLeadingSpaceExp.test(value)) return;
      break;
    }
    default:
      break;
  }

  edit.update({
    [fieldName]: value,
  });
};

export const generateCombinations = (
  variations: Record<string, string[]>
): any[] => {
  const keys = Object.keys(variations);
  if (keys.length === 0) return [];

  const combine = (arr1: any[], arr2: any[], key: string) =>
    arr1.flatMap((item1) =>
      arr2.map((item2) => ({
        ...item1,
        [key]: item2,
      }))
    );

  return keys.reduce((acc, key) => combine(acc, variations[key], key), [{}]);
};
