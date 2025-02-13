import { TestBed } from '@angular/core/testing';

import {
    ClientConfigProductName,
    LazyClientConfig,
    LazyClientConfigBase,
    LazyClientConfigService,
    getClientConfigProperties,
} from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { ClientConfigDiff } from '../../src/client-config/client-config.model';
import { ClientConfigServiceMock } from '../client-config/client-config.mock';

@LazyClientConfig({ key: 'eager1', product: ClientConfigProductName.SF })
class EagerConfig1 extends LazyClientConfigBase {
    prop: string;
}

@LazyClientConfig({ key: 'lazy1', product: ClientConfigProductName.SF })
class LazyConfig1 extends LazyClientConfigBase {
    prop: string;
}

describe('LazyClientConfigService', () => {
    let service: LazyClientConfigService;
    let clientConfigServiceMock: ClientConfigServiceMock;

    beforeEach(() => {
        clientConfigServiceMock = MockContext.useMock(ClientConfigServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, LazyClientConfigService],
        });

        service = TestBed.inject(LazyClientConfigService);
    });

    describe('get', () => {
        let spy: jasmine.Spy;

        beforeEach(() => {
            clientConfigServiceMock.load.calls.reset();
            spy = jasmine.createSpy();
        });

        it('should notify when config is ready', () => {
            const config = service.get(EagerConfig1);
            expect(config.isConfigReady).toBeFalse();
            config.whenReady.subscribe(spy);

            setConfig({ eager1: { prop: 'a' } });

            expect(spy).toHaveBeenCalled();
            expect(config.isConfigReady).toBeTrue();
            expect(config.prop).toBe('a');
        });

        it('should lazy load config', () => {
            const config = service.get(LazyConfig1);
            expect(config.isConfigReady).toBeFalse();
            config.whenReady.subscribe(spy);

            expect(clientConfigServiceMock.load).toHaveBeenCalledWith('', [LazyConfig1]);

            setConfig({ lazy1: { prop: 'a' } });

            expect(spy).toHaveBeenCalled();
            expect(config.isConfigReady).toBeTrue();
            expect(config.prop).toBe('a');
        });

        it('should throw if config is accessed when not yet ready', () => {
            const config = service.get(EagerConfig1);

            expect(() => config.prop).toThrowError();
        });

        it('should not throw if ngOnDestroy is accessed (angular checks this internally)', () => {
            const config = service.get(EagerConfig1);

            expect(() => (config as any)['ngOnDestroy']).not.toThrowError();
        });
    });

    function setConfig(config: { [name: string]: any }) {
        const update: ClientConfigDiff = new Map();
        Object.keys(config).forEach((c) => update.set(c, new Map()));
        clientConfigServiceMock.updates.next(update);

        clientConfigServiceMock.get.and.callFake((c) => config[getClientConfigProperties(c).key]);
    }
});
