import { InjectionToken, Injector, Type } from '@angular/core';

export class InjectorStub extends Injector {
    private stubsLocator: Map<Type<any> | InjectionToken<any>, any>;

    constructor() {
        super();
        this.stubsLocator = new Map<Type<any> | InjectionToken<any>, any>();
    }

    get<T>(token: Type<T> | InjectionToken<T>): T {
        return this.stubsLocator.get(token);
    }

    add<T>(token: Type<T> | InjectionToken<T>, val: any): void {
        this.stubsLocator.set(token, val);
    }
}

export class LocalStoreServiceStub {
    private testStorage: { [key: string]: any } = {};

    get(key: string): any {
        return this.testStorage[key];
    }

    set(key: string, value: any): void {
        this.testStorage[key] = value;
    }

    remove(key: string): void {
        delete this.testStorage[key];
    }
}
