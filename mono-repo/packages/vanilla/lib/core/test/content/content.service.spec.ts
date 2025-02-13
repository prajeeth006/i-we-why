import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ClientConfigProductName, ContentService, TimerService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';
import { of } from 'rxjs';

import { VanillaApiServiceMock } from '../../src/http/test/vanilla-api.mock';
import { DslServiceMock } from '../dsl/dsl.mock';
import { ProductServiceMock } from '../products/product.mock';

describe('ContentService', () => {
    let service: ContentService;
    let apiServiceMock: VanillaApiServiceMock;
    let dslServiceMock: DslServiceMock;
    let productServiceMock: ProductServiceMock;
    let path: string;
    let observableSpy: jasmine.Spy;

    beforeEach(() => {
        apiServiceMock = MockContext.useMock(VanillaApiServiceMock);
        dslServiceMock = MockContext.useMock(DslServiceMock);
        productServiceMock = MockContext.useMock(ProductServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, TimerService, ContentService],
        });

        productServiceMock.current.apiBaseUrl = 'apiBase';

        service = TestBed.inject(ContentService);

        path = '/App-v1.0/some/content';
        observableSpy = jasmine.createSpy('observableSpy');
    });

    describe('getJsonFiltered()', () => {
        it('should return filtered content', () => {
            service.getJsonFiltered(path).subscribe(observableSpy);

            expect(apiServiceMock.get).toHaveBeenCalledWith('content', { path: path, filterOnClient: true }, { baseUrl: 'apiBase', headers: {} });

            const content = { templateName: 'aa' };
            const filtered = { templateName: 'bb' };

            dslServiceMock.evaluateContent.withArgs(content).and.returnValue(of(filtered));
            apiServiceMock.get.completeWith(content);

            expect(observableSpy).toHaveBeenCalledWith(filtered);
        });
    });

    describe('getJson()', () => {
        it('should get public page', () => {
            productServiceMock.getMetadata.withArgs('sports').and.returnValue({ isEnabled: true, apiBaseUrl: 'sportsbaseurl' });
            service.getJson(path, { product: ClientConfigProductName.SPORTS }).subscribe(observableSpy);

            expect(apiServiceMock.get).toHaveBeenCalledWith(
                'content',
                { path: path, filterOnClient: undefined },
                { baseUrl: 'sportsbaseurl', headers: { 'x-bwin-sports-api': 'test' } },
            );

            const content = { templateName: 'aa' };

            apiServiceMock.get.completeWith(content);

            expect(observableSpy).toHaveBeenCalledWith(content);
        });

        it('should cache content for 5 min', fakeAsync(() => {
            service.getJson(path).subscribe(observableSpy);
            service.getJson(path).subscribe(observableSpy);

            expect(apiServiceMock.get).toHaveBeenCalledTimes(1);

            const content = { templateName: 'aa' };

            apiServiceMock.get.completeWith(content);

            expect(observableSpy).toHaveBeenCalledTimes(2);

            tick(3 * 60 * 1000);

            service.getJson(path).subscribe(observableSpy);
            expect(apiServiceMock.get).toHaveBeenCalledTimes(1);
            expect(observableSpy).toHaveBeenCalledTimes(3);

            tick(2 * 60 * 1000);

            service.getJson(path).subscribe(observableSpy);
            expect(apiServiceMock.get).toHaveBeenCalledTimes(2);
            apiServiceMock.get.completeWith(content);
            expect(observableSpy).toHaveBeenCalledTimes(4);

            tick(5 * 60 * 1000);
        }));
    });
});
