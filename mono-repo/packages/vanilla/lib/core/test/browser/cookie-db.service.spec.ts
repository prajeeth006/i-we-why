import { TestBed } from '@angular/core/testing';

import { CookieDBService, CookieList } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { CookieServiceMock } from './cookie.mock';

describe('CookieDBService', () => {
    let service: CookieDBService;
    let db: CookieList<string>;
    let cookieServiceMock: CookieServiceMock;
    let items: any[];
    const key = 'kk';

    beforeEach(() => {
        cookieServiceMock = MockContext.useMock(CookieServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, CookieDBService],
        });

        service = TestBed.inject(CookieDBService);

        cookieServiceMock.put.and.callFake((k: string, v: string) => {
            if (k === key) {
                items = JSON.parse(v);
            }
        });
        cookieServiceMock.getObject.withArgs(key).and.callFake(() => items);
    });

    describe('list', () => {
        beforeEach(() => {
            items = [];
            db = service.createList(key);
        });

        describe('insert()', () => {
            it('should store values', () => {
                db.insert('a');

                expect(items.length).toBe(1);
                expect(items[0]).toBe('a');
            });
        });

        describe('get()', () => {
            it('should return filtered values', () => {
                items = ['a', 'a', 'b'];

                expect(db.get((i) => i === 'a')).toEqual(['a', 'a']);
            });

            it('should return empty array if no values are stored', () => {
                items = <any>undefined;

                expect(db.get((i) => i === 'a')).toEqual([]);
            });
        });

        describe('getOne()', () => {
            it('should return first value that matches the predicate', () => {
                items = ['a', 'a', 'b', 'c'];

                expect(db.getOne((i) => i === 'b')).toEqual('b');
            });
        });

        describe('getAll()', () => {
            it('should return all stored values', () => {
                items = ['a', 'a', 'b'];

                expect(db.getAll()).toEqual(['a', 'a', 'b']);
            });
        });

        describe('delete()', () => {
            it('should remove all values that match the predicate', () => {
                items = ['a', 'a', 'b'];

                db.delete((i) => i === 'a');

                expect(items).toEqual(['b']);
            });
        });

        describe('deleteAll()', () => {
            it('should remove all values', () => {
                items = ['a', 'a', 'b'];

                db.deleteAll();

                expect(items).toEqual([]);
            });
        });

        describe('update()', () => {
            it('should execute an action on all items that match the predicate', () => {
                items = [{ name: 'a' }, { name: 'a' }, { name: 'b' }];

                db.update(
                    (i) => (i as any)['name'] === 'a',
                    (i) => ((i as any)['x'] = 1),
                );

                expect(items[0]['x']).toBe(1);
                expect(items[1]['x']).toBe(1);
                expect(items[2]['x']).toBeUndefined();
            });
        });

        describe('updateAll()', () => {
            it('should execute an action on all items', () => {
                items = [{ name: 'a' }, { name: 'a' }, { name: 'b' }];

                db.updateAll((i) => ((i as any)['x'] = 1));

                expect(items[0]['x']).toBe(1);
                expect(items[1]['x']).toBe(1);
                expect(items[2]['x']).toBe(1);
            });
        });
    });
});
