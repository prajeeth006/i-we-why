import { Message } from '@frontend/vanilla/core';

/**
 * @stable
 */
export interface ValidationRuleSet extends Record<string, string> {
    required: string;
    minLength: string;
    minLengthErrorMapping: string;
    maxLength: string;
    maxLengthErrorMapping: string;
    min: string;
    max: string;
    regex: string;
    regexErrorMapping: string;
}

/**
 * @stable
 */
export interface ServerFieldValidationViolation extends Message {
    fieldName?: string;
    validationError?: string;
}
