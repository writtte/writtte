const ERROR_CODES = {
  REQUIRED: 'ERR_REQUIRED' as const,
  PATTERN: 'ERR_PATTERN' as const,
  MIN: 'ERR_MIN' as const,
  MAX: 'ERR_MAX' as const,
};

type TValidation = {
  name: string;
  value: string | number | undefined | null;
  rules: {
    pattern?: RegExp;
    min?: number;
    max?: number;
    required?: boolean;
  };
};

type TValidationErrorCode =
  | 'ERR_REQUIRED'
  | 'ERR_PATTERN'
  | 'ERR_MIN'
  | 'ERR_MAX';

type TValidationResult = {
  name: string;
  isValid: boolean;
  errors: TValidationErrorCode[];
};

const validate = (
  inputs: TValidation[],
): {
  isValid: boolean;
  results: TValidationResult[];
} => {
  let allValid = true;

  const results: TValidationResult[] = [];

  for (const input of inputs) {
    const result = validateSingle(input);
    results.push(result);

    if (!result.isValid) {
      allValid = false;
    }
  }

  return { isValid: allValid, results };
};

const validateSingle = (input: TValidation): TValidationResult => {
  const errors: TValidationErrorCode[] = [];

  const { value, rules, name } = input;

  const stringValue =
    value !== null && value !== undefined ? String(value) : '';

  if (
    rules.required &&
    (value === null || value === undefined || stringValue.trim() === '')
  ) {
    return {
      name,
      isValid: false,
      errors: [ERROR_CODES.REQUIRED],
    };
  }

  if (
    (value === null || value === undefined || stringValue === '') &&
    !rules.required
  ) {
    return { name, isValid: true, errors: [] };
  }

  const { pattern, min, max } = rules;

  const isNumber = typeof value === 'number';

  if (pattern && !pattern.test(stringValue)) {
    errors.push(ERROR_CODES.PATTERN);
  }

  if (min !== undefined) {
    if (isNumber ? value < min : stringValue.length < min) {
      errors.push(ERROR_CODES.MIN);
    }
  }

  if (max !== undefined) {
    if (isNumber ? value > max : stringValue.length > max) {
      errors.push(ERROR_CODES.MAX);
    }
  }

  return {
    name,
    isValid: errors.length === 0,
    errors,
  };
};

export type { TValidation, TValidationErrorCode, TValidationResult };

export { ERROR_CODES, validate };
