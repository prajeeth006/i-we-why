import { CookieDBService } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';

@Mock({ of: CookieDBService })
export class CookieDBServiceMock {
    @Stub() createList: jasmine.Spy;

    constructor() {
        this.createList.and.returnValue(new FakeListDB());
    }
}

export class FakeListDB {
    private store: any[] = [];

    get(predicate: (item: any) => boolean): any[] {
        return this.store.filter(predicate);
    }
    getOne(predicate: (item: any) => boolean) {
        return this.store.find(predicate);
    }
    insert(item: any): void {
        this.store.push(item);
    }
    update(predicate: (item: any) => boolean, action: (item: any) => void): void {
        this.store.filter(predicate).forEach(action);
    }
    delete(predicate: (item: any) => boolean): void {
        this.store = this.store.filter((i) => !predicate(i));
    }
    deleteFirstMatch(predicate: (item: any) => boolean): void {
        this.store = this.store.filter((i) => !predicate(i));
    }
    getAll(): any[] {
        return this.store;
    }
    updateAll(action: (item: any) => void): void {
        this.store.forEach(action);
    }
    deleteAll(): void {
        this.store = [];
    }
}
