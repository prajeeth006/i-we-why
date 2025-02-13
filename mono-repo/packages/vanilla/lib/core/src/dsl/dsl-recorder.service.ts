import { Injectable } from '@angular/core';

import { Logger } from '../logging/logger';
import { DslRecordable, DslRecordableType, DslRecording } from './dsl.models';

/**
 * If any dsl provider returns this value, the result of the whole expression is `false`. Whoever returns this value
 * should invalidate corresponding refs in dsl cache when the data is loaded so dependent expressions are reevaluated.
 */
export const DSL_NOT_READY: any = '__DSL_NOT_READY__';

/**
 * @whatItDoes Helper service for creating DSL providers
 *
 * @description
 *
 * See {@link DslValuesProvider}.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class DslRecorderService {
    private recording: DslRecording | null;

    constructor(private log: Logger) {}

    /** Creates a configurable proxy object that can be used as a DSL provider. */
    createRecordable(type: string): DslRecordable {
        return new Proxy(new DslRecordable(type), {
            get: (target: DslRecordable, name: string) => {
                if (name in target) {
                    return target[name];
                }

                if (!this.recording) {
                    throw new Error('Recordable member requested when not recording.');
                }

                const providerName = target.providerName;
                const config = target.config.get(name);

                if (!config) {
                    throw new Error(`${name} is not defined on the recordable.`);
                } else {
                    switch (config.type) {
                        case DslRecordableType.Property:
                            config.dependenciesFactory().forEach((d) => this.recording!.deps.add(d));

                            return this.executeProvider(() => config.fn());
                        case DslRecordableType.Function:
                        case DslRecordableType.Action:
                            return new Proxy(config.fn, {
                                apply: (target, thisArg, args: any[]) => {
                                    config.dependenciesFactory(...args).forEach((d) => this.recording!.deps.add(d));

                                    const result = this.executeProvider(() => target.apply(thisArg, args));

                                    if (config.type === DslRecordableType.Action) {
                                        const argsStr = args.map((a) => (typeof a === 'string' ? `'${a}'` : a)).join(', ');

                                        this.log.debug(`DSL action: ${providerName}.${name}(${argsStr})`);
                                    }
                                    return result;
                                },
                            });
                    }
                }
            },
        });
    }

    beginRecording() {
        this.recording = new DslRecording();
    }

    endRecording(): DslRecording {
        if (!this.recording) {
            throw new Error(`Recording wasn't started`);
        }

        const result = this.recording;

        this.recording = null;

        return result;
    }

    private executeProvider(fn: () => any): Function {
        const result = fn();

        if (result === DSL_NOT_READY) {
            throw new Error(DSL_NOT_READY);
        }

        return result;
    }
}
