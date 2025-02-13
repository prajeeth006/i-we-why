import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { WebpackManifestService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { VanillaApiServiceMock } from '../../../core/src/http/test/vanilla-api.mock';

describe('WebpackManifestService', () => {
    let service: WebpackManifestService;
    let apiService: VanillaApiServiceMock;

    beforeEach(() => {
        apiService = MockContext.useMock(VanillaApiServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, WebpackManifestService],
        });
        service = TestBed.inject(WebpackManifestService);
    });

    describe('getEntry()', () => {
        it('should not be defined', fakeAsync(() => {
            const spy = jasmine.createSpy();
            service.getEntry('test').then(spy);
            apiService.get.completeWith({});
            tick();

            expect(spy).toHaveBeenCalledWith(undefined);
        }));

        it('should get entries and load only once', fakeAsync(() => {
            const spy1 = jasmine.createSpy();
            const spy2 = jasmine.createSpy();
            const spy3 = jasmine.createSpy();
            service.getEntry('test').then(spy1);
            service.getEntry('best').then(spy2);

            apiService.get.completeWith({ test: '/x/test', best: '/x/best', rest: '/x/rest' });
            tick();
            service.getEntry('rest').then(spy3);
            tick();

            expect(spy1).toHaveBeenCalledWith('/x/test');
            expect(spy2).toHaveBeenCalledWith('/x/best');
            expect(spy3).toHaveBeenCalledWith('/x/rest');
            expect(apiService.get).toHaveBeenCalledOnceWith('assets/manifest');
        }));
    });
});
