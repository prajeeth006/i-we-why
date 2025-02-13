/**
 * Instances of this class are created by {@link DslRecorderService}. There are a few chainable methods that allow configuration of methods
 * and properties on the DSL providers.
 *
 * @stable
 */
export class DslRecordable {
    [key: string]: any; // Making the class indexable to be able to use this[propertyName];

    /**
     * @internal
     */
    config: Map<string, DslRecordableConfigRecord> = new Map();

    /**
     * @internal
     */
    providerName: string;

    /**
     * @internal
     */
    constructor(private type: string) {}

    createSimpleProperty<T>(source: T, property: keyof T, name: string) {
        this.config.set(name, {
            type: DslRecordableType.Property,
            fn: () => {
                const value = source[property];
                if (value == null) {
                    return '';
                }

                return value;
            },
            dependenciesFactory: this.createDependenciesFactory(undefined, `${this.type}.${property.toString()}`),
        });

        return this;
    }

    createProperty(options: DslRecordablePropertyOptions) {
        this.config.set(options.name, {
            type: DslRecordableType.Property,
            fn: options.get,
            dependenciesFactory: this.createDependenciesFactory(options.deps, `${this.type}.${options.name}`),
        });

        return this;
    }

    createFunction(options: DslRecordableFunctionOptions) {
        this.config.set(options.name, {
            type: DslRecordableType.Function,
            fn: options.get,
            dependenciesFactory: this.createDependenciesFactory(options.deps, `${this.type}.${options.name}`),
        });

        return this;
    }

    createAction(options: DslRecordableActionOptions) {
        this.config.set(options.name, {
            type: DslRecordableType.Action,
            fn: options.fn,
            dependenciesFactory: () => [],
        });

        return this;
    }

    private createDependenciesFactory(
        option: string | (string | DslRecordableKey)[] | ((...args: any[]) => string[]) | undefined,
        defaultValue: string,
    ): (...args: any[]) => string[] {
        let deps: DslRecordableKey[] = [];

        if (option) {
            if (option instanceof Function) {
                return option;
            } else if (Array.isArray(option)) {
                deps = option.map((o: string | DslRecordableKey) => {
                    if (typeof o === 'string') {
                        return { key: o, args: 0 };
                    } else {
                        return o;
                    }
                });
            } else {
                deps = [{ key: option, args: 0 }];
            }
        } else {
            deps = [{ key: defaultValue, args: 0 }];
        }

        return (...args: any[]) => {
            return deps.map((d) => {
                let key = d.key;

                for (let i = 0; i < d.args; i++) {
                    if (d.argsToLowerCase) {
                        key += `.${args[i]}`.toLowerCase();
                    } else {
                        key += `.${args[i]}`;
                    }
                }

                return key;
            });
        };
    }
}

export class DslRecording {
    deps = new Set<string>();
}

export enum DslEnvExecutionMode {
    Expression,
    Action,
}

export enum DslRecordableType {
    Property,
    Function,
    Action,
}

export interface DslContext {
    [provider: string]: DslRecordable;
}

export interface DslEnvResult {
    result: any;
    error?: Error;
    deps: Set<string>;
    notReady?: boolean | undefined; // Optional undefined
}

export interface DslCacheRecord {
    result: boolean;
    dependencies: Set<string>;
    notReady?: boolean | undefined; // Optional undefined
}

export interface DslRecordablePropertyOptions {
    /** A getter that returns the value of the provider member. */
    get: () => any;
    /** The provider member name (must match the server side provider name). */
    name: string;
    /** A key, keys, or a function that returns the keys which are stored as a cache dependency in {@link DslCacheService}. */
    deps?: string | string[] | (() => string[]);
}

export interface DslRecordableKey {
    args: number;
    key: string;
    argsToLowerCase?: boolean;
}

export interface DslRecordableFunctionOptions {
    /** A getter that returns the value of the provider member. */
    get: (...args: any[]) => any;
    /** The provider member name (must match the server side provider name). */
    name: string;
    /** A key, keys, or a function that returns the keys which are stored as a cache dependency in {@link DslCacheService}. */
    deps?: string | string[] | DslRecordableKey[] | ((...args: any[]) => string[]);
}

export interface DslRecordableActionOptions {
    /** A getter that returns the value of the provider member. */
    fn: (...args: any[]) => void;
    /** The provider member name (must match the server side provider name). */
    name: string;
}

export interface DslRecordableConfigRecord {
    fn: (...args: any[]) => any;
    dependenciesFactory: (...args: any[]) => string[];
    type: DslRecordableType;
}

export interface ListRequest {
    listName: string;
    item: string;
}

export interface AsyncDslResponseBase {
    passed: boolean;
}

export interface ListResponse extends ListRequest, AsyncDslResponseBase {}

/**
 * @whatItDoes An interface used for providing DSL providers.
 *
 * @howToUse
 *
 * ```
 * @Injectable()
 * export class SampleDslValuesProvider implements DslValuesProvider {
 *     constructor(private dslRecorderService: DslRecorderService, private sampleService: SampleService, dslCacheService: DslCacheService) {
 *         this.sampleServices.changes.subscribe(() => {
 *             dslCacheService.invalidate(['sample.value']);
 *         });
 *     }
 *
 *     getProviders(): { [provider: string]: DslRecordable } {
 *         return {
 *             Sample: this.dslRecorderService.createRecordable('sample')
 *                 .createProperty({ name: 'Prop', get: () => this.sampleService.getValue(), deps: 'sample.value' })
 *         };
 *     }
 * }
 *
 * @NgModule()
 * export class SampleModule {
 *     static forRoot(): ModuleWithProviders<SampleModule> {
 *         return {
 *             ngModule: SampleModule,
 *             providers: [
 *                 runDslOnFeatureInit(SampleDslProvider),
 *             ]
 *         };
 *     }
 * }
 * ```
 *
 * @stable
 */
export interface DslValuesProvider {
    getProviders(): { [provider: string]: DslRecordable };
}

export interface GetGroupAttributeRequest {
    groupName: string;
    groupAttribute: string;
}

export interface GetGroupAttributeResponse extends GetGroupAttributeRequest, AsyncDslResponseBase {
    value: string;
}
