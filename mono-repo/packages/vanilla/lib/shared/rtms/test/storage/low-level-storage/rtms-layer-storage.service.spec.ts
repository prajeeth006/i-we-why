import { TestBed } from '@angular/core/testing';

import { STORE_PREFIX } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { LocalStoreServiceMock } from '../../../../../core/test/browser/local-store.mock';
import { RtmsLocalStoreService } from '../../../src/storage/low-level-storage/rtms-localstorage.service';
import { RtmsLayerStorageBase } from '../../../src/storage/low-level-storage/rtms-storage-base.model';

describe('RtmsStorageServices', () => {
    const commonStorageChecker: (storage: RtmsLayerStorageBase) => void = (storageService: RtmsLayerStorageBase): void => {
        const testStrVal = { key: 'testkey1', val: 'testval' };
        const testObjVal = { key: 'testkey2', val: { somekey: 'somekey', someval: 'someval' } };
        storageService.set(testStrVal.key, testStrVal.val);
        storageService.get(testStrVal.key).subscribe((res: any) => {
            expect(res).toBeDefined();
            expect(res).toBe(testStrVal.val);
        });

        //------------------------------------------------------

        storageService.set(testObjVal.key, testObjVal.val);
        storageService.get(testObjVal.key).subscribe((res: any) => {
            expect(res).toBeDefined();
            expect(res).toEqual(testObjVal.val);
        });

        //------------------------------------------------------

        storageService.remove(testStrVal.key);
        storageService.remove(testObjVal.key);
        storageService.get(testStrVal.key).subscribe((res: any) => expect(res).toBeUndefined());
        storageService.get(testObjVal.key).subscribe((res: any) => expect(res).toBeUndefined());
    };

    describe('RtmsLocalStoreService', () => {
        let service: RtmsLocalStoreService;
        beforeEach(() => {
            MockContext.useMock(LocalStoreServiceMock);

            TestBed.configureTestingModule({
                providers: [MockContext.providers, RtmsLocalStoreService, { provide: STORE_PREFIX, useValue: 'van.' }],
            });
            service = TestBed.inject(RtmsLocalStoreService);
        });
        it('set and get work correctly', () => commonStorageChecker(service));
    });
});
