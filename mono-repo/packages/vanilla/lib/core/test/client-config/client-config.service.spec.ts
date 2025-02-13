import { Type } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ClaimsConfig, ClientConfig, ClientConfigProductName, ClientConfigService, UserConfig, WINDOW } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { WindowMock } from '../../../core/src/browser/window/test/window-ref.mock';
import { HttpClientMock } from './http-client.mock';

@ClientConfig({ key: 'testConfig', product: ClientConfigProductName.SF })
class TestConfig {
    prop: string;
    prop2: string;
    prop3: string;
}

@ClientConfig({ key: 'config1', product: ClientConfigProductName.SF })
class Test1Config {
    prop: string;
}

@ClientConfig({ key: 'config2', product: ClientConfigProductName.SF })
class Test2Config {}

@ClientConfig({ key: 'config3', product: ClientConfigProductName.SF })
class Test3Config {
    prop: string;
}

@ClientConfig({ key: 'config4', product: ClientConfigProductName.HOST })
class Test4Config {
    prop: string;
}

@ClientConfig({ key: 'configSports', product: ClientConfigProductName.SPORTS })
class TestConfigSports {
    prop: string;
}

@ClientConfig({ key: 'configCasino', product: ClientConfigProductName.CASINO })
class TestConfigCasino {
    prop: string;
}

describe('ClientConfigService', () => {
    let service: ClientConfigService;
    let httpClientMock: HttpClientMock;
    let windowMock: WindowMock;
    let testConfig: TestConfig;
    let subscribeSpy: jasmine.Spy;

    beforeEach(() => {
        httpClientMock = MockContext.useMock(HttpClientMock);
        windowMock = new WindowMock();

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                ClientConfigService,
                { provide: TestConfig, deps: [ClientConfigService], useFactory: (s: ClientConfigService) => s.get(TestConfig) },
                { provide: Test1Config, deps: [ClientConfigService], useFactory: (s: ClientConfigService) => s.get(Test1Config) },
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });

        windowMock['clientConfig'] = {
            testConfig: {
                prop: 'val',
                prop2: 'val2',
            },
            config2: {
                propa: 'vala',
            },
            vnPage: {
                propa: 'vala',
                environment: 'qa2',
            },
            vnProducts: {
                sf: { enabled: true, apiBaseUrl: 'https://shared-features-api.bwin.com' },
                host: { enabled: true, apiBaseUrl: 'https://host.bwin.com' },
                sports: { enabled: true, apiBaseUrl: 'https://sports.bwin.com' },
                casino: { enabled: true, apiBaseUrl: 'https://casino.bwin.com' },
            },
            haApp: {
                productPathMap: { sports: 'sports', casino: 'games', portal: 'myaccount' },
                allowedPaths: ['myaccount', 'Games'],
            },
            __durations: {},
        };

        service = TestBed.inject(ClientConfigService);
        testConfig = TestBed.inject(TestConfig);
        subscribeSpy = jasmine.createSpy('subscribeSpy');
        service.updates.subscribe(subscribeSpy);
    });

    describe('get()', () => {
        it('should return config objects', () => {
            expect(service.get(TestConfig)).toBe(TestBed.inject(TestConfig));
        });
    });

    describe('load()', () => {
        it('should load config from the specified endpoint and merge in new configs', fakeAsync(() => {
            service.load('endpoint');
            tick();

            expect(httpClientMock.get).toHaveBeenCalledWith('endpoint/en/api/clientconfig', { headers: {}, withCredentials: true });
            httpClientMock.get.completeWith({
                config1: {
                    prop: 'x',
                },
            });

            tick();

            const config1: Test1Config = TestBed.inject(Test1Config);
            expect(config1.prop).toBe('x');
        }));

        it('should load specified configs from the specified endpoint and merge in new configs', fakeAsync(() => {
            service.load('/endpoint', [Test1Config]);
            tick();
            expect(httpClientMock.get).toHaveBeenCalledWith('https://shared-features-api.bwin.com/endpoint/en/api/clientconfig/partial', {
                params: { configNames: ['config1'] },
                headers: { 'x-bwin-sf-api': 'qa2' },
                withCredentials: true,
            });
            httpClientMock.get.completeWith({
                config1: {
                    prop: 'x',
                },
                __durations: {},
            });

            tick();
            const config1: Test1Config = TestBed.inject(Test1Config);
            expect(config1.prop).toBe('x');
        }));

        it('should throw if requested config is missing from the response', fakeAsync(() => {
            const spy = jasmine.createSpy();
            // eslint-disable-next-line @typescript-eslint/use-unknown-in-catch-callback-variable
            service.load('endpoint', [Test1Config]).catch(spy);

            httpClientMock.get.completeWith({
                config5: {
                    prop: 'x',
                },
            });

            tick();

            expect(spy).toHaveBeenCalled();
        }));

        it('should not throw if requested config is already loaded and remove from list', fakeAsync(() => {
            const spy = jasmine.createSpy();
            // eslint-disable-next-line @typescript-eslint/use-unknown-in-catch-callback-variable
            service.load('/endpoint', [TestConfig, Test1Config]).catch(spy);

            tick();

            expect(httpClientMock.get).toHaveBeenCalledWith(jasmine.anything(), {
                params: { configNames: ['config1'] },
                headers: { 'x-bwin-sf-api': 'qa2' },
                withCredentials: true,
            });
            expect(spy).not.toHaveBeenCalled();
        }));

        it('should load specified configs with correct header from the specified endpoint and merge in new configs', fakeAsync(() => {
            windowMock['clientConfig']['vnPage'] = { environment: 'dev' };

            service.load('/endpoint', [Test1Config, Test3Config, Test4Config]);
            tick();

            expectHttpCalls();

            httpClientMock.get.completeWith({
                config1: {
                    prop: 'x',
                },
                config3: {
                    prop: 'x',
                },
                __durations: {},
            });
            httpClientMock.get.completeWith({
                config4: {
                    prop: 'x',
                },
                __durations: {},
            });

            tick();
            const config1: Test1Config = TestBed.inject(Test1Config);
            expect(config1.prop).toBe('x');
        }));

        it('should reload config from the same endpoint it has been loaded from', fakeAsync(() => {
            service.load('/endpoint');

            httpClientMock.get.completeWith({
                config1: {
                    prop: 'x',
                },
            });

            tick();

            httpClientMock.get.calls.reset();

            service.reload([Test1Config]);

            expect(httpClientMock.get).toHaveBeenCalledWith('https://shared-features-api.bwin.com/endpoint/en/api/clientconfig/partial', {
                params: { configNames: ['config1'] },
                headers: { 'x-bwin-sf-api': 'qa2' },
                withCredentials: true,
            });
        }));

        it('should reload config from the same endpoint with correct header', fakeAsync(() => {
            windowMock['clientConfig']['vnPage'] = { environment: 'dev' };

            service.load('endpoint', [Test1Config, Test3Config, Test4Config]);
            tick();

            expectHttpCalls();

            httpClientMock.get.completeWith({
                config1: {
                    prop: 'x',
                },
                config3: {
                    prop: 'x',
                },
                __durations: {},
            });
            httpClientMock.get.completeWith({
                config4: {
                    prop: 'x',
                },
                __durations: {},
            });

            tick();

            httpClientMock.get.calls.reset();

            service.reload([Test1Config, Test3Config, Test4Config]);

            expectHttpCalls();
        }));
    });

    describe('reload()', () => {
        it('should call api with specified config names', () => {
            service.reload([TestConfig, Test2Config]);

            expect(httpClientMock.get).toHaveBeenCalledWith('https://shared-features-api.bwin.com/en/api/clientconfig/partial', {
                params: { configNames: ['testConfig', 'config2'] },
                headers: { 'x-bwin-sf-api': 'qa2' },
                withCredentials: true,
            });
        });

        it('should call api with fallback endpoint when config not loaded yet', () => {
            service.reload([Test1Config], true);

            expect(httpClientMock.get).toHaveBeenCalledWith('https://shared-features-api.bwin.com/en/api/clientconfig/partial', {
                params: { configNames: ['config1'] },
                headers: { 'x-bwin-sf-api': 'qa2', 'X-Reload-On-Login': 1 },
                withCredentials: true,
            });
        });

        it('should call api only for allowed products.', () => {
            windowMock.SINGLE_DOMAIN = '1';
            service.reload([TestConfig, TestConfigCasino, TestConfigSports], true);

            expect(httpClientMock.get).toHaveBeenCalledWith('https://shared-features-api.bwin.com/en/api/clientconfig/partial', {
                params: { configNames: ['testConfig'] },
                headers: { 'x-bwin-sf-api': 'qa2', 'X-Reload-On-Login': 1 },
                withCredentials: true,
            });
            expect(httpClientMock.get).toHaveBeenCalledWith('https://casino.bwin.com/en/api/clientconfig/partial', {
                params: { configNames: ['configCasino'] },
                headers: { 'x-bwin-casino-api': 'qa2', 'X-Reload-On-Login': 1 },
                withCredentials: true,
            });
            expect(httpClientMock.get).toHaveBeenCalledTimes(2);
        });

        it('should not call api when no configs are specified', () => {
            service.reload(<Type<any>[]>[]);

            expect(httpClientMock.get).not.toHaveBeenCalled();
        });

        it('should return a promise', fakeAsync(() => {
            const spy = jasmine.createSpy();

            service.reload([TestConfig]).then(spy);

            httpClientMock.get.completeWith({
                testConfig: {
                    prop: 'val',
                    prop3: 'val3',
                },
            });

            tick();

            expect(spy).toHaveBeenCalledWith(
                new Map([
                    [
                        'testConfig',
                        new Map([
                            ['prop3', 'val3'],
                            ['prop2', undefined],
                        ]),
                    ],
                ]),
            );
        }));

        it('should update config properties and emit update event with diff', fakeAsync(() => {
            service.reload([TestConfig]);

            httpClientMock.get.completeWith({
                testConfig: {
                    prop: 'val',
                    prop3: 'val3',
                },
            });

            tick();

            expect(testConfig.prop).toBe('val');
            expect(testConfig.hasOwnProperty('prop2')).toBeFalse();
            expect(testConfig.prop3).toBe('val3');

            expect(subscribeSpy).toHaveBeenCalledWith(
                new Map([
                    [
                        'testConfig',
                        new Map([
                            ['prop3', 'val3'],
                            ['prop2', undefined],
                        ]),
                    ],
                ]),
            );
        }));

        it('should not emit update event if no property has changed', fakeAsync(() => {
            service.reload([TestConfig]);

            httpClientMock.get.completeWith({
                testConfig: {
                    prop: 'val',
                    prop2: 'val2',
                },
            });

            tick();

            expect(testConfig.prop).toBe('val');
            expect(testConfig.prop2).toBe('val2');

            expect(subscribeSpy).not.toHaveBeenCalled();
        }));

        it('should not emit diff for config that hasnt been changed', fakeAsync(() => {
            service.reload([TestConfig, Test2Config]);

            httpClientMock.get.completeWith({
                testConfig: {
                    prop: 'val',
                    prop2: 'val2',
                },
                config2: {
                    propa: 'x',
                },
            });

            tick();

            expect(subscribeSpy).toHaveBeenCalledWith(new Map([['config2', new Map([['propa', 'x']])]]));
        }));
    });

    describe('update()', () => {
        it('should update configs', fakeAsync(() => {
            service.update({
                testConfig: {
                    prop: 'x',
                    prop2: 'y',
                },
            });

            tick();

            expect(testConfig.prop).toBe('x');
            expect(testConfig.prop2).toBe('y');

            expect(subscribeSpy).toHaveBeenCalledWith(
                new Map([
                    [
                        'testConfig',
                        new Map([
                            ['prop', 'x'],
                            ['prop2', 'y'],
                        ]),
                    ],
                ]),
            );
        }));

        it('should not remove existing properties when they are missing in update obj', fakeAsync(() => {
            service.update({
                testConfig: {
                    prop: 'x',
                },
            });

            tick();

            expect(testConfig.prop).toBe('x');
            expect(testConfig.prop2).toBe('val2');

            expect(subscribeSpy).toHaveBeenCalledWith(new Map([['testConfig', new Map([['prop', 'x']])]]));
        }));

        it('should remove existing properties when they are missing in update obj and keepExistingProperties is false', fakeAsync(() => {
            service.update(
                {
                    testConfig: {
                        prop: 'x',
                    },
                },
                { keepExistingProperties: false },
            );

            tick();

            expect(testConfig.prop).toBe('x');
            expect(testConfig.hasOwnProperty('prop2')).toBeFalse();

            expect(subscribeSpy).toHaveBeenCalledWith(
                new Map([
                    [
                        'testConfig',
                        new Map([
                            ['prop', 'x'],
                            ['prop2', undefined],
                        ]),
                    ],
                ]),
            );
        }));
    });

    describe('reloadOnLogin()', () => {
        let spy: jasmine.Spy;

        beforeEach(() => {
            windowMock['configsToReloadOnLogin'] = [UserConfig];
            spy = spyOn(service, 'reload');
        });

        it('should update just configs from configsToReloadOnLogin', () => {
            service.reloadOnLogin();

            expect(spy).toHaveBeenCalledWith([UserConfig], true);
        });

        it('should update passed configs and configsToReloadOnLogin', () => {
            service.reloadOnLogin([ClaimsConfig]);

            expect(spy).toHaveBeenCalledWith([ClaimsConfig, UserConfig], true);
        });
    });

    function expectHttpCalls() {
        expect(httpClientMock.get.calls.all().map((call: any) => call.args)).toEqual([
            [
                'https://shared-features-api.bwin.com/endpoint/en/api/clientconfig/partial',
                {
                    params: { configNames: ['config1', 'config3'] },
                    headers: { 'x-bwin-sf-api': 'dev' },
                    withCredentials: true,
                },
            ],
            [
                'https://host.bwin.com/endpoint/en/api/clientconfig/partial',
                {
                    params: { configNames: ['config4'] },
                    headers: { 'x-bwin-host-api': 'dev' },
                    withCredentials: true,
                },
            ],
        ]);
    }
});
