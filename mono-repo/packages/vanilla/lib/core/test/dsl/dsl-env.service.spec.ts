import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { DSL_NOT_READY, DSL_VALUES_PROVIDER, DslEnvService, DslValuesProvider } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { DslEnvExecutionMode, DslRecording } from '../../src/dsl/dsl.models';
import { LoggerMock } from '../languages/logger.mock';
import { ProductServiceMock } from '../products/product.mock';
import { UserServiceMock } from '../user/user.mock';
import { DslCacheServiceMock } from './dsl-cache.mock';
import { DslRecorderServiceMock } from './value-providers/dsl-recorder.mock';

class UserDslValuesProviderMock implements DslValuesProvider {
    getProviders(): any {
        return {
            User: {
                LoginName: 'test',
                Country: 'AT',
                IsRealPlayer: true,
            },
        };
    }
}

const cookieGetter = jasmine.createSpy('Cookies.Get');

class CookieDslValuesProviderMock implements DslValuesProvider {
    getProviders(): any {
        return {
            Cookies: {
                Get: cookieGetter,
            },
        };
    }
}

class ClaimDslValuesProviderMock implements DslValuesProvider {
    getProviders(): any {
        return {
            Claims: {
                Get: jasmine.createSpy('Claims.Get').withArgs('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name').and.returnValue('test'),
            },
        };
    }
}

class LocationDslValuesProviderMock implements DslValuesProvider {
    getProviders(): any {
        return {
            Request: {
                AbsoluteUri: 'http://dev.www.bwin.com:1337/en/casino/play/blackjack?mode=real#hash',
                Redirect: jasmine.createSpy('Request.Redirect'),
            },
            QueryString: {
                Get: jasmine.createSpy('QueryString.Get').withArgs('mode').and.returnValue('real'),
            },
        };
    }
}

class ListDslValuesProviderMock implements DslValuesProvider {
    getProviders(): any {
        return {
            List: {
                Contains: jasmine.createSpy('List.Contains').withArgs('Sample', 'lol').and.returnValue(true),
            },
        };
    }
}

class MediaDslValuesProviderMock implements DslValuesProvider {
    getProviders(): any {
        return {
            Media: {
                IsActive: jasmine.createSpy('Media.IsActive').withArgs('md').and.returnValue(true),
            },
        };
    }
}

class ProductDslValuesProviderMock implements DslValuesProvider {
    getProviders(): any {
        return {
            Test: {
                Value: 'val',
            },
        };
    }
}

class AsyncDslValuesProviderMock implements DslValuesProvider {
    getProviders(): any {
        return {
            NotReady: {
                Value: () => {
                    throw new Error(DSL_NOT_READY);
                },
            },
        };
    }
}

describe('DslEnvService', () => {
    let dslEnvService: DslEnvService;
    let dslCacheServiceMock: DslCacheServiceMock;
    let dslRecorderServiceMock: DslRecorderServiceMock;
    let loggerMock: LoggerMock;
    let productServiceMock: ProductServiceMock;
    let recording: DslRecording;
    let userServiceMock: UserServiceMock;

    beforeEach(() => {
        dslCacheServiceMock = MockContext.useMock(DslCacheServiceMock);
        dslRecorderServiceMock = MockContext.useMock(DslRecorderServiceMock);
        loggerMock = MockContext.useMock(LoggerMock);
        productServiceMock = MockContext.useMock(ProductServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                DslEnvService,
                { provide: DSL_VALUES_PROVIDER, useClass: UserDslValuesProviderMock, multi: true },
                { provide: DSL_VALUES_PROVIDER, useClass: ClaimDslValuesProviderMock, multi: true },
                { provide: DSL_VALUES_PROVIDER, useClass: LocationDslValuesProviderMock, multi: true },
                { provide: DSL_VALUES_PROVIDER, useClass: CookieDslValuesProviderMock, multi: true },
                { provide: DSL_VALUES_PROVIDER, useClass: ListDslValuesProviderMock, multi: true },
                { provide: DSL_VALUES_PROVIDER, useClass: MediaDslValuesProviderMock, multi: true },
                { provide: DSL_VALUES_PROVIDER, useClass: AsyncDslValuesProviderMock, multi: true },
            ],
        });

        const productInjector = Injector.create({
            providers: [
                { provide: ProductDslValuesProviderMock, deps: [] },
                { provide: DSL_VALUES_PROVIDER, useExisting: ProductDslValuesProviderMock, multi: true },
            ],
            parent: TestBed.inject(Injector),
        });

        productServiceMock.current.isHost = false;
        productServiceMock.current.injector = productInjector;
        userServiceMock.isAuthenticated = false;

        recording = new DslRecording();
        dslRecorderServiceMock.endRecording.and.callFake(() => recording);

        dslEnvService = TestBed.inject(DslEnvService);
        dslEnvService.registerDefaultValuesNotReadyDslProviders({
            'c.Balance.IsLow': false,
            'c.Balance.AccountBalance': -1,
            'c.BonusAbuserInformation.IsBonusAbuser': false,
            'c.KycStatus.EmailVerificationStatus': '"Unknown"',
            'c.SessionFundSummary.Profit': -1,
            'c.SessionFundSummary.TotalStake': -1,
        });
    });

    function testDsl(condition: string, expectedResult: any, executionMode = DslEnvExecutionMode.Expression, setup?: () => void) {
        it('should filter ' + condition, () => {
            if (setup) {
                setup();
            }

            const result = dslEnvService.run(condition, executionMode);

            expect(result.result).toBe(expectedResult);
            expect(result.error).not.toBeDefined();
            expect(result.notReady).toBeFalse();
            expect(loggerMock.errorRemote).not.toHaveBeenCalled();
        });
    }

    function setupCookie(name: string, value: string) {
        cookieGetter.withArgs(name).and.returnValue(value);
    }

    testDsl('c.User.LoginName === "test"', true);

    testDsl('c.Request.AbsoluteUri === "http://dev.www.bwin.com:1337/en/casino/play/blackjack?mode=real#hash"', true);

    testDsl('c.Cookies.Get("cname") === "hello"', true, DslEnvExecutionMode.Expression, () => {
        setupCookie('cname', 'hello');
    });

    testDsl('c.Claims.Get("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name") === "test"', true);

    testDsl('c.QueryString.Get("mode") === "real"', true);

    testDsl('c.List.Contains("Sample", "lol")', true);

    testDsl('c.Media.IsActive("md")', true);

    testDsl('if(c.Media.IsActive("md")){c.Request.Redirect("dest");}', undefined, DslEnvExecutionMode.Action); // Action

    testDsl('c.User.LoginName !== "test"', false); // not equal
    testDsl('c.User.Country === "AT" && !c.User.IsRealPlayer', false); // AND + NOT
    testDsl('c.User.Country === "AT" || !c.User.IsRealPlayer', true); // OR + NOT
    testDsl('new RegExp("GB|AT").test(c.User.Country)', true); // MATCHES operator
    testDsl('["GB","AT"].includes(c.User.Country)', true); // IN operator
    testDsl('c.Request.AbsoluteUri.endsWith("hash")', true); // ENDSWITH operator
    testDsl('c.Request.AbsoluteUri.includes("bwin.com")', true); // CONTAINS operator
    testDsl('c.Request.AbsoluteUri.startsWith("http")', true); // STARTSWITH operator

    testDsl('c.User.providerName', 'User');
    testDsl('c.Cookies.providerName', 'Cookies');

    it('should fire change event when cache is invalidated', () => {
        const spy = jasmine.createSpy('spy');
        dslEnvService.change.subscribe(spy);

        dslCacheServiceMock.invalidation.next(new Set(['dep']));

        expect(spy).toHaveBeenCalledWith(new Set(['dep']));
    });

    it('should return true for empty expression', () => {
        expect(dslEnvService.run(<any>undefined).result).toBeTrue();
    });

    it("should return result from cache if it's available", () => {
        dslCacheServiceMock.get.withArgs('test').and.returnValue({ result: true, dependencies: new Set(['dep']), notReady: true });

        expect(dslEnvService.run('test')).toEqual({ result: true, deps: new Set(['dep']), notReady: true });

        expect(dslRecorderServiceMock.beginRecording).not.toHaveBeenCalled();
    });

    it('should not return error if expression does not contain not ready dsl providers exact match', () => {
        setupCookie('cname', 'Balance in the middle of the content');
        const result = dslEnvService.run('c.Cookies.Get("cname") === "Balance in the middle of the content"');

        expect(result.result).toBeTrue();
        expect(result.error).not.toBeDefined();
        expect(result.notReady).toBeFalse();
        expect(loggerMock.errorRemote).not.toHaveBeenCalled();
    });

    it('should return error if expression contains not ready dsl providers', () => {
        userServiceMock.isAuthenticated = true;
        const result = dslEnvService.run('c.Balance.AccountBalance');

        expect(result.error).toEqual(new Error('Expression contains DSL providers not yet registered: c.Balance.AccountBalance.'));
        expect(result.notReady).toBeTrue();
    });

    it('should not use cache for actions', () => {
        dslCacheServiceMock.get.withArgs('test').and.returnValue({ result: true, dependencies: new Set(['dep']), notReady: true });

        dslEnvService.run('test', DslEnvExecutionMode.Action);

        expect(dslRecorderServiceMock.beginRecording).toHaveBeenCalled();
    });

    it('should set result to cache with dependencies', () => {
        recording.deps.add('location');
        const expr = 'c.Request.AbsoluteUri === "http://dev.www.bwin.com:1337/en/casino/play/blackjack?mode=real#hash"';

        dslEnvService.run(expr);

        expect(dslRecorderServiceMock.beginRecording).toHaveBeenCalled();
        expect(dslCacheServiceMock.set).toHaveBeenCalledWith(expr, true, recording.deps, false);
    });

    it('should log error when evaluation fails', () => {
        const result = dslEnvService.run('INVALID');

        expect(result.result).toBeUndefined();
        expect(result.error).toBeDefined();
        expect(loggerMock.errorRemote).toHaveBeenCalled();
    });

    it('should add providers from product injector', () => {
        const result = dslEnvService.run('c.Test.Value');

        expect(result.result).toBe('val');
    });

    it('should return undefined if any provider is not ready', () => {
        const expr = 'c.NotReady.Value()';

        const result = dslEnvService.run(expr);

        expect(result.result).toBeUndefined();
        expect(result.notReady).toBeTrue();
    });

    describe('whenStable()', () => {
        it('should proxy to dslCacheService', () => {
            const spy = jasmine.observable();
            dslCacheServiceMock.whenStable.and.returnValue(spy);

            const value = dslEnvService.whenStable();

            expect(value).toBe(spy);
        });
    });

    function testUnregisteredDsl(condition: string, expectedResult: any, executionMode = DslEnvExecutionMode.Expression) {
        it('should replace default values ' + condition, () => {
            const result = dslEnvService.run(condition, executionMode);

            expect(result.result).toBe(expectedResult);
            expect(result.error).not.toBeDefined();
            expect(result.notReady).toBeFalse();
            expect(loggerMock.errorRemote).not.toHaveBeenCalled();
        });
    }

    testUnregisteredDsl('c.Balance.AccountBalance', -1);
    testUnregisteredDsl('c.Balance.AccountBalance > 0', false);
    testUnregisteredDsl('c.BonusAbuserInformation.IsBonusAbuser', false);
    testUnregisteredDsl('!c.BonusAbuserInformation.IsBonusAbuser', true);
    testUnregisteredDsl('c.KycStatus.EmailVerificationStatus', 'Unknown');
    testUnregisteredDsl('c.KycStatus.EmailVerificationStatus !== "Unknown"', false);
    testUnregisteredDsl('c.KycStatus.EmailVerificationStatus === "Unknown"', true);
    testUnregisteredDsl('c.KycStatus.EmailVerificationStatus !== "Unknown" && !c.BonusAbuserInformation.IsBonusAbuser', false);
    testUnregisteredDsl('c.KycStatus.EmailVerificationStatus !== "Unknown" || !c.BonusAbuserInformation.IsBonusAbuser', true);
    testUnregisteredDsl('c.KycStatus.EmailVerificationStatus.endsWith("known")', true);
    testUnregisteredDsl('c.KycStatus.EmailVerificationStatus.includes("nkn")', true);
    testUnregisteredDsl('c.KycStatus.EmailVerificationStatus.startsWith("Unkn")', true);
    testUnregisteredDsl('c.SessionFundSummary.TotalStake-c.SessionFundSummary.Profit', 0);
    testUnregisteredDsl('c.SessionFundSummary.TotalStake+c.SessionFundSummary.Profit', -2);
    testUnregisteredDsl('c.SessionFundSummary.TotalStake/c.SessionFundSummary.Profit', 1);
    testUnregisteredDsl('c.SessionFundSummary.TotalStake*c.SessionFundSummary.Profit', 1);
    testUnregisteredDsl('c.QueryString.Get("mode") === "real" && (c.SessionFundSummary.TotalStake+c.SessionFundSummary.Profit) > 0', false);
    testUnregisteredDsl('c.Balance.IsLow(c.Balance.AccountBalance, -1, "test")', false);
    testUnregisteredDsl('((!(c.BonusAbuserInformation.IsBonusAbuser)&&c.Balance.IsLow(25))&&(c.Balance.AccountBalance>1))', false);
});
