import { TestBed } from '@angular/core/testing';

import { LocalStoreService, STORE_PREFIX, SessionStoreService, WINDOW } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { StorageMock, WindowMock } from '../../../core/src/browser/window/test/window-ref.mock';

describe('StoreServices', () => {
    let store: LocalStoreService | SessionStoreService;
    let windowMock: WindowMock;

    beforeEach(() => {});

    function testStore(type: 'local' | 'session') {
        const id = type;

        function getKey() {
            return 'van.key';
        }

        describe(id, () => {
            let storage: StorageMock;

            function initStore() {
                TestBed.configureTestingModule({
                    providers: [
                        MockContext.providers,
                        LocalStoreService,
                        SessionStoreService,
                        { provide: STORE_PREFIX, useValue: 'van.' },
                        {
                            provide: WINDOW,
                            useValue: windowMock,
                        },
                    ],
                });

                if (type === 'local') {
                    store = TestBed.inject(LocalStoreService);
                } else {
                    store = TestBed.inject(SessionStoreService);
                }
            }

            beforeEach(() => {
                windowMock = new WindowMock();
                storage = windowMock[type + 'Storage'];
            });

            describe('standard', () => {
                beforeEach(() => {
                    initStore();
                });

                it('should store items in JSON', () => {
                    store.set('key', 'val');

                    expect(storage.setItem).toHaveBeenCalledWith(getKey(), JSON.stringify('val'));
                });

                it('should retrieve items from JSON', () => {
                    storage.getItem.withArgs(getKey()).and.returnValue(JSON.stringify('val'));

                    expect(store.get<string>('key')).toBe('val');
                });

                it('should remove items', () => {
                    store.remove('key');

                    expect(storage.removeItem).toHaveBeenCalledWith(getKey());
                });

                it('should remove items when set to null', () => {
                    store.set('key', null);

                    expect(storage.removeItem).toHaveBeenCalledWith(getKey());
                });

                it('should return keys without prefix', () => {
                    (storage as any)[getKey()] = 'val';

                    expect(store.keys()).toEqual(['key']);
                });
            });

            describe('fallback', () => {
                beforeEach(() => {
                    storage.setItem.and.throwError('QUOTA_EXCEEDED_ERR');

                    initStore();

                    storage.setItem.calls.reset();
                });

                it('should should fallback to array', () => {
                    store.set('key', 'val');

                    expect(storage.setItem).not.toHaveBeenCalled();

                    expect(store.get<string>('key')).toBe('val');
                    expect(store.keys()).toEqual(['key']);

                    expect(storage.getItem).not.toHaveBeenCalled();

                    store.set('key', null);

                    expect(storage.removeItem).not.toHaveBeenCalled();

                    expect(store.get<string>('key')).toBeNull();
                });
            });
        });
    }

    testStore('local');
    testStore('session');
});
