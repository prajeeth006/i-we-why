import { Injectable } from '@angular/core';

import { Observable, NEVER as never } from 'rxjs';
import { map } from 'rxjs/operators';

import { ValidationRuleSet } from '../validation/validation.models';
import { ValidationHelperService } from './validation-helper.service';

const PARSER = /\[((?:\w+,?)+)\]=val\((.+?)\)/g;

class DynamicPropertyValidationConfig {
    defaultValue: string;
    defaultMapping: string;
    values: Map<string, string>;
    errorMapping: Map<string, string>;

    constructor(public key: string) {}

    getValue(dep: string) {
        const value = this.values.get(dep);
        return value || this.defaultValue;
    }

    getMapping(dep: string) {
        if (!this.errorMapping) {
            return null;
        }

        const mapping = this.errorMapping.get(dep);
        return mapping || this.defaultMapping;
    }
}

/**
 * @stable
 */
export class DynamicValidationUpdateEvent {
    constructor(
        public rules: ValidationRuleSet,
        public mappings: { [key: string]: string | null },
    ) {}
}

/**
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class DynamicValidationService {
    constructor(private validationHelper: ValidationHelperService) {}

    register(field: string, depObserver: Observable<any>): Observable<DynamicValidationUpdateEvent> {
        const baseRules = this.validationHelper.getRawRules(field);
        if (!baseRules) {
            return never;
        }

        const config = this.parseConfig(field);

        return depObserver.pipe(
            map((v: any) => {
                const rules: ValidationRuleSet = Object.assign({}, baseRules);
                const mappings: Record<string, string | null> = {};

                config.forEach((value) => {
                    rules[value.key] = value.getValue(v);
                    mappings[value.defaultMapping || value.key] = value.getMapping(v);
                });

                return new DynamicValidationUpdateEvent(rules, mappings);
            }),
        );
    }

    private parseConfig(field: string): Map<string, DynamicPropertyValidationConfig> {
        const rules = this.validationHelper.getRawRules(field)!;

        return Object.keys(rules)
            .filter((r) => !r.endsWith('ErrorMapping'))
            .map((r) => this.parsePropertyConfig(rules, r))
            .reduce((result, config) => result.set(config.key, config), new Map());
    }

    private parsePropertyConfig(rules: ValidationRuleSet, validationKey: string) {
        const expr = rules[validationKey]!;
        const mappingExpr = rules[validationKey + 'ErrorMapping']!;

        const config = new DynamicPropertyValidationConfig(validationKey);

        const values = this.parseExpression(expr);
        config.defaultValue = values.defaultValue || expr; // in case of static config just assign value as defaultValue per default
        config.values = values.map;

        if (mappingExpr) {
            const mappings = this.parseExpression(mappingExpr);
            config.defaultMapping = mappings.defaultValue!;
            config.errorMapping = mappings.map;
        }

        return config;
    }

    private parseExpression(expr: string) {
        let defaultValue: string | null = null;
        const map = new Map<string, string>();
        let match: RegExpMatchArray | null;
        while ((match = PARSER.exec(expr))) {
            const key = match[1]!;
            if (key === 'DEFAULT') {
                defaultValue = match[2]!;
            } else {
                key.split(',').forEach((k) => {
                    map.set(k, match![2]!);
                });
            }
        }

        return { defaultValue, map };
    }
}
