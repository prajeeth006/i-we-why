import { Injectable } from '@angular/core';

/**
 * Defines handler signature for {@link GenericActionsService#register-anchor}.
 *
 * @stable
 */
export interface GenericActionHandler {
    (...args: any[]): any;
}

/**
 * @whatItDoes Allows applications to register callbacks from outside of vanilla.
 *
 * @description
 *
 * Applications that use vanilla framework can register or override actions, that are executed by other components.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class GenericActionsService {
    private handlers = new Map<string, GenericActionHandler>();

    register(name: string, fn: GenericActionHandler) {
        this.handlers.set(name, fn);
    }

    isRegistered(name: string) {
        return this.handlers.has(name);
    }

    invoke(name: string, args?: any[]): any {
        if (!name) {
            throw new Error('Name to execute generic action is required.');
        }

        args = args || [];
        const fn = this.handlers.get(name);

        if (!fn) {
            throw new Error(`No generic action is registered with the name ${name}.`);
        }

        return fn.apply(null, args);
    }
}
