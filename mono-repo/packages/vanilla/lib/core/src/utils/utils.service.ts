import { Injectable } from '@angular/core';

const EMAIL_REGEXP =
    /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;

/**
 * @whatItDoes Specifies utility methods
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class UtilsService {
    generateGuid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0,
                v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    format(template: string, ...args: any[]): string {
        if (template === undefined) {
            return template;
        }

        let result = template;

        for (let i = 0; i < args.length; i++) {
            const value = args[i] !== undefined ? args[i] : '';
            result = result.replace(new RegExp('\\{' + i + '\\}', 'gim'), value);
        }

        return result;
    }

    /**
     * Validate if input is email
     */
    isEmail(input: string): boolean {
        return EMAIL_REGEXP.test(input);
    }

    /**
     * Creates a mixin from two objects of different types.
     * @param first first object to create a mixin from
     * @param second second object to create a mixin from
     * @returns a mixin as a new object instance
     */
    extend<T extends Object, U extends Object>(first: T, second: U): T & U {
        const result = <T & U>{};

        for (const id in first) {
            (<any>result)[id] = (<any>first)[id];
        }

        for (const id in second) {
            if (!result.hasOwnProperty(id)) {
                (<any>result)[id] = (<any>second)[id];
            }
        }

        return result;
    }

    static indexableTypeContainsKey(obj: { [key: string]: string }, searchValue: string): boolean {
        for (let key in obj) {
            if (obj[key] === searchValue) {
                return true;
            }
        }
        return false;
    }
}
