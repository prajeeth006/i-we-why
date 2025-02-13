import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { AppInfoConfigMock } from '../../src/client-config/test/app-info-config.mock';
import { LastKnownProductBootstrapService } from '../../src/last-known-product/last-known-product-bootstrap.service';
import { DslServiceMock } from '../dsl/dsl.mock';
import { LastKnownProductConfigMock } from './last-known-product-config.mock';
import { LastKnownProductServiceMock } from './last-known-product.mock';

describe('LastKnownProductBootstrapService', () => {
    let service: LastKnownProductBootstrapService;
    let lastKnownProductConfigMock: LastKnownProductConfigMock;
    let dslServiceMock: DslServiceMock;
    let lastKnownProductServiceMock: LastKnownProductServiceMock;

    beforeEach(() => {
        lastKnownProductConfigMock = MockContext.useMock(LastKnownProductConfigMock);
        dslServiceMock = MockContext.useMock(DslServiceMock);
        lastKnownProductServiceMock = MockContext.useMock(LastKnownProductServiceMock);
        MockContext.useMock(AppInfoConfigMock);

        TestBed.configureTestingModule({
            providers: [...MockContext.providers, LastKnownProductBootstrapService],
        });

        service = TestBed.inject(LastKnownProductBootstrapService);
        lastKnownProductConfigMock.url = 'https://bwin.com/home';
        lastKnownProductConfigMock.product = 'sports';
        lastKnownProductConfigMock.enabled = 'TRUE';
    });

    describe('onAppInit()', () => {
        it('should call add method if enabled and current product is different then saved one', () => {
            lastKnownProductServiceMock.get.and.returnValue({ name: 'casino', url: 'https://casino.bwin.com' });
            service.onAppInit();
            dslServiceMock.evaluateExpression.completeWith(true);

            expect(lastKnownProductServiceMock.add).toHaveBeenCalledWith({
                name: 'sports',
                previous: 'casino',
                url: 'https://bwin.com/home',
                platformProductId: 'POKER',
            });
        });

        it('should call add method if last know product url is different than config url and product is the same', () => {
            lastKnownProductServiceMock.get.and.returnValue({ name: 'sports', url: 'https://casino.bwin.com', previous: 'casino' });
            service.onAppInit();
            dslServiceMock.evaluateExpression.completeWith(true);

            expect(lastKnownProductServiceMock.add).toHaveBeenCalledWith({
                name: 'sports',
                previous: 'casino',
                url: 'https://bwin.com/home',
                platformProductId: 'POKER',
            });
        });

        it('should not do anything', () => {
            service.onAppInit();
            dslServiceMock.evaluateExpression.completeWith(false);

            expect(lastKnownProductServiceMock.add).not.toHaveBeenCalled();
        });
    });
});
