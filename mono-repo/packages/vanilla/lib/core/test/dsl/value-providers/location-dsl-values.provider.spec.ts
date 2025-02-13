import { TestBed } from '@angular/core/testing';

import { DslRecorderService, LocationChangeEvent, QuerySearchParams, UrlService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { LocationDslValuesProvider } from '../../../src/dsl/value-providers/location-dsl-values-provider';
import { PageMock } from '../../browsercommon/page.mock';
import { LoggerMock } from '../../languages/logger.mock';
import { NavigationServiceMock } from '../../navigation/navigation.mock';
import { DslCacheServiceMock } from '../dsl-cache.mock';
import { DslNavigationServiceMock } from '../dsl-navigation.mock';

describe('LocationDslValuesProvider', () => {
    let target: any;
    let provider: LocationDslValuesProvider;
    let navigationServiceMock: NavigationServiceMock;
    let dslCacheServiceMock: DslCacheServiceMock;
    let dslNavigationServiceMock: DslNavigationServiceMock;
    let pageMock: PageMock;

    beforeEach(() => {
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        dslCacheServiceMock = MockContext.useMock(DslCacheServiceMock);
        dslNavigationServiceMock = MockContext.useMock(DslNavigationServiceMock);
        pageMock = MockContext.useMock(PageMock);
        MockContext.useMock(LoggerMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, DslNavigationServiceMock, LocationDslValuesProvider],
        });

        provider = TestBed.inject(LocationDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();

        dslNavigationServiceMock.location.absUrl.and.returnValue('abs');
        dslNavigationServiceMock.location.path.and.returnValue('path');
        dslNavigationServiceMock.location.url.and.returnValue('url');
        dslNavigationServiceMock.location.culture = 'en123';
        dslNavigationServiceMock.location.search = new QuerySearchParams('a=b&c=d');

        pageMock.isInternal = true;
        pageMock.isPrerendered = true;
        pageMock.clientIP = '127.0.0.0';

        const url = TestBed.inject(UrlService).parse('http://bwin.com/en/page?a=b&c=d');
        dslNavigationServiceMock.location.clone.and.returnValue(url);
    });

    describe('Request', () => {
        beforeEach(() => {
            target = provider.getProviders()['Request'];
        });

        it('shoud return isInternal, isPrerendered, clientIP and culture', () => {
            expect(target['IsInternal']).toBeTrue();
            expect(target['IsPrerendered']).toBeTrue();
            expect(target['ClientIP']).toBe('127.0.0.0');
            expect(target['CultureToken']).toBe('en123');
        });

        describe('AbsoluteUri', () => {
            it('should return abosute url', () => {
                expect(target['AbsoluteUri']).toBe('abs');
            });
        });

        describe('AbsolutePath', () => {
            it('should return path', () => {
                expect(target['AbsolutePath']).toBe('path');
            });
        });

        describe('PathAndQuery', () => {
            it('should return path', () => {
                expect(target['PathAndQuery']).toBe('url');
            });
        });

        describe('Query', () => {
            it('should return query', () => {
                expect(target['Query']).toBe('?a=b&c=d');
            });

            it('should return empty string if there is no query', () => {
                dslNavigationServiceMock.location.search = new QuerySearchParams('');

                expect(target['Query']).toBe('');
            });
        });

        describe('Redirect', () => {
            it('should redirect to absolute url', () => {
                target['Redirect']('http://party.com/en/casino');

                expect(getNavigatedUrl()).toBe('http://party.com/en/casino');
            });

            it('should redirect to relative url', () => {
                target['Redirect']('/en/casino');

                expect(getNavigatedUrl()).toEndWith('/en/casino');
            });

            it('should keep query if absolute url redirect', () => {
                target['Redirect']('http://party.com/en/casino?a=x', false, true);

                expect(getNavigatedUrl()).toBe('http://party.com/en/casino?a=x&c=d');
            });

            it('should keep query if relative url redirect', () => {
                target['Redirect']('/en/casino?a=x', false, true);

                expect(getNavigatedUrl()).toEndWith('/en/casino?a=x&c=d');
            });
        });
    });

    describe('QueryString', () => {
        beforeEach(() => {
            target = provider.getProviders()['QueryString'];
        });

        describe('Get', () => {
            it('should return a query string parameter value', () => {
                const value = target['Get']('a');

                expect(value).toBe('b');
            });

            it('should return empty string if key is not present in query string', () => {
                const value = target['Get']('xx');

                expect(value).toBeEmptyString();
            });
        });

        describe('Set', () => {
            it('should add query string parameter if new one', () => {
                target['Set']('x', 'y');

                expect(getNavigatedUrl()).toBe('http://bwin.com/en/page?a=b&c=d&x=y');
            });

            it('should overwrite query string parameter if already exists', () => {
                target['Set']('a', 'x');

                expect(getNavigatedUrl()).toBe('http://bwin.com/en/page?a=x&c=d');
            });
        });

        describe('Remove', () => {
            it('should remove query string paramter', () => {
                target['Remove']('a');

                expect(getNavigatedUrl()).toBe('http://bwin.com/en/page?c=d');
            });

            it('should do nothing if parameter does not exist', () => {
                target['Remove']('x');

                expect(getNavigatedUrl()).toBe('http://bwin.com/en/page?a=b&c=d');
            });
        });
    });

    function getNavigatedUrl() {
        return dslNavigationServiceMock.enqueueRedirect.calls.argsFor(0)[0].absUrl();
    }

    describe('watcher', () => {
        it('should should invalidate location when location changes', () => {
            navigationServiceMock.locationChange.next({ previousUrl: 'bwin.com/', nextUrl: 'bwin.com/' } as LocationChangeEvent);
            expect(dslCacheServiceMock.invalidate).not.toHaveBeenCalled();

            navigationServiceMock.locationChange.next({ previousUrl: 'bwin.com/', nextUrl: 'bwin.com/test' } as LocationChangeEvent);
            expect(dslCacheServiceMock.invalidate).toHaveBeenCalledWith(['location']);
        });
    });
});
