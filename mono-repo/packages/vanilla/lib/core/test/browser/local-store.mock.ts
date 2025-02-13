import { Mock, Stub } from 'moxxi';

import { LocalStoreService } from '../../src/browser/store/local-store.service';

@Mock({ of: LocalStoreService })
export class LocalStoreServiceMock {
    @Stub() set: jasmine.Spy;
    @Stub() get: jasmine.Spy;
    @Stub() remove: jasmine.Spy;

    private values: Map<string, any> = new Map();

    constructor() {
        this.set.and.callFake((key: string, value: any) => {
            this.values.set(key, value);
        });

        this.get.and.callFake((key: string) => this.values.get(key));

        this.remove.and.callFake((key: string) => this.values.delete(key));
    }
}
