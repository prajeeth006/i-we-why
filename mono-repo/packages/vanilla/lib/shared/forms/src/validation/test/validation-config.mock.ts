import { Mock } from 'moxxi';

import { ValidationConfig, ValidationRuleSet } from '../../forms';

@Mock({ of: ValidationConfig })
export class ValidationConfigMock {
    regexList: { [name: string]: string } = {};
    rules: { [name: string]: ValidationRuleSet } = {};
    errorMapping: { [name: string]: string } = {};
}
