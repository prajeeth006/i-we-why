import { TestBed } from '@angular/core/testing';

import { LastKnownProductService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { CookieServiceMock } from '../browser/cookie.mock';
import { LastKnownProductConfigMock } from './last-known-product-config.mock';

describe('LastKnownProductService', () => {
    let service: LastKnownProductService;
    let cookieServiceMock: CookieServiceMock;
    let lastKnownProductConfigMock: LastKnownProductConfigMock;

    beforeEach(() => {
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        lastKnownProductConfigMock = MockContext.useMock(LastKnownProductConfigMock);

        TestBed.configureTestingModule({
            providers: [...MockContext.providers, LastKnownProductService],
        });

        service = TestBed.inject(LastKnownProductService);
        lastKnownProductConfigMock.url = 'https://bwin.com/home';
    });

    describe('add()', () => {
        it('should add cookie', () => {
            const spy = jasmine.createSpy();
            service.update.subscribe(spy);
            const lkp = { name: 'sports', platformProductId: 'POKER', previous: 'casino', url: 'https://bwin.com' };

            service.add(lkp);

            expect(cookieServiceMock.putObject).toHaveBeenCalledWith('lastKnownProduct', lkp, { expires: jasmine.anything() });
            expect(spy).toHaveBeenCalled();
        });
    });

    describe('get()', () => {
        it('should return default value', () => {
            const lkp = service.get();

            expect(lkp).toEqual({ name: 'unknown', platformProductId: '', previous: 'unknown', url: 'https://bwin.com/home' });
        });

        it('should return value from cookie', () => {
            const lkp = { name: 'sports', platformProductId: 'casinoId', previous: 'casino', url: 'https://bwin.com' };
            cookieServiceMock.getObject.and.returnValue(lkp);
            const value = service.get();

            expect(value).toEqual(lkp);
        });
    });
});
