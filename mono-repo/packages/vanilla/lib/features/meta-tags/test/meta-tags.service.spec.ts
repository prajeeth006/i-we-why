import { TestBed } from '@angular/core/testing';

import { QuerySearchParams } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { PageServiceMock, RevertiblePageChangeMock } from '../../../core/test/browsercommon/page.service.mock';
import { LoggerMock } from '../../../core/test/languages/logger.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { MetaTagsService } from '../src/meta-tags.service';
import { MetaTagsConfigMock } from './meta-tags.mock';

describe('MetaTagsService', () => {
    let service: MetaTagsService;
    let pageServiceMock: PageServiceMock;
    let log: LoggerMock;
    let metaTagsConfigMock: MetaTagsConfigMock;
    let navigationServiceMock: NavigationServiceMock;
    let changes: RevertiblePageChangeMock[];

    beforeEach(() => {
        changes = [];

        pageServiceMock = MockContext.useMock(PageServiceMock);
        pageServiceMock.setTitle.and.callFake(getMockedChange);
        pageServiceMock.setMeta.and.callFake(getMockedChange);

        log = MockContext.useMock(LoggerMock);

        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        navigationServiceMock.location.path.and.returnValue('/page1');
        navigationServiceMock.location.search = new QuerySearchParams('');
        metaTagsConfigMock = MockContext.useMock(MetaTagsConfigMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, MetaTagsService],
        });
        service = TestBed.inject(MetaTagsService);

        metaTagsConfigMock.pageMetaTags = [
            {
                urlPath: '/page1',
                urlQueryParams: {
                    q: 'a',
                    P: 'B',
                },
                title: 'Page with Query',
                tags: {
                    testQ: 'page with query',
                },
            },
            {
                urlPath: '/page1',
                urlQueryParams: {},
                title: 'Page 1',
                tags: {
                    testTag: 'test value',
                },
            },
        ];
        metaTagsConfigMock.globalMetaTags = [
            {
                ruleName: 'Rule 1',
                tags: {
                    globalTag: 'global tag',
                    testTag: 'global test value',
                },
                urlPathAndQueryRegexes: ['page\\d'],
            },
            {
                ruleName: 'Rule 2',
                tags: {
                    globalTagQ: 'global tag with query',
                },
                urlPathAndQueryRegexes: ['\\?Q=a&p=B'],
            },
        ];
    });

    it('should render configured SEO tags', () => {
        service.initialize(); // act

        expect(pageServiceMock.setTitle).toHaveBeenCalledWith('Page 1');
        expectPageServiceSetMeta({
            testTag: 'test value',
            globalTag: 'global tag',
        });
        expect(changes.length).toBe(3);
        expectRevertedTimes(changes, 0);
        expect(log.errorRemote).not.toHaveBeenCalled();
    });

    it('should skip invalid regexes in global rules', () => {
        metaTagsConfigMock.globalMetaTags[0]!.urlPathAndQueryRegexes.push('page(');

        service.initialize(); // act

        expect(log.errorRemote).toHaveBeenCalled();
        const msg = log.errorRemote.calls.argsFor(0)[0];
        expect(msg).toContain('/page(/');
        expect(msg).toContain('"Rule 1"');
    });

    it('should re-render tags on navigation', () => {
        service.initialize();
        navigationServiceMock.location.search = new QuerySearchParams('Q=A&p=b');
        pageServiceMock.setTitle.calls.reset();
        pageServiceMock.setMeta.calls.reset();
        const firstPageChanges = changes.slice();

        navigationServiceMock.locationChange.next({ id: 0, nextUrl: '', previousUrl: '' }); // act

        expect(pageServiceMock.setTitle).toHaveBeenCalledWith('Page with Query');
        expectPageServiceSetMeta({
            testQ: 'page with query',
            globalTagQ: 'global tag with query',
            testTag: 'global test value',
            globalTag: 'global tag',
        });
        expectRevertedTimes(firstPageChanges, 1);
        expectRevertedTimes(changes.slice(firstPageChanges.length), 0);
    });

    describe('setPageTags()', () => {
        it('should set title & tags', () => {
            navigationServiceMock.location.path.and.returnValue('/explicit');
            service.initialize();

            // act
            service.setPageTags('Explicit Title', { explicitTag: 'explicit value' });

            expect(pageServiceMock.setTitle).toHaveBeenCalledWith('Explicit Title');
            expectPageServiceSetMeta({ explicitTag: 'explicit value' });
            expect(changes.length).toBe(2);
            expectRevertedTimes(changes, 0);
        });

        it('should set title & tags honoring SEO configuration', () => {
            service.initialize();

            // act
            service.setPageTags('disregarded title', {
                testTag: 'disregarded tag 1',
                TESTtag: 'disregarded tag 2',
                explicitTag: 'explicit value',
            });

            expect(pageServiceMock.setTitle).toHaveBeenCalledWith('Page 1');
            expectPageServiceSetMeta({
                testTag: 'test value',
                globalTag: 'global tag',
                explicitTag: 'explicit value',
            });
            expect(changes.length).toBe(4);
            expectRevertedTimes(changes, 0);
        });

        it('should throw if invalid tag name specified', () => {
            expect(() => service.setPageTags(undefined, { '  ': 'invalid' })).toThrowError(
                'Tag name cannot be null nor white-space but such one was specified with value "invalid".',
            );
        });
    });

    describe('clearPageTags', () => {
        it('should clear only previously set tags', () => {
            navigationServiceMock.location.path.and.returnValue('/explicit');
            service.initialize();

            // act
            service.setPageTags('Explicit Title', { explicitTag: 'explicit value' });

            service.clearPageTags();

            expectRevertedTimes(changes, 1);
        });

        it('should clear only previously set tags, but keep global ones', () => {
            service.initialize();

            // act
            service.setPageTags('disregarded title', {
                testTag: 'disregarded tag 1',
                explicitTag: 'explicit value',
            });

            service.clearPageTags();

            expectRevertedTimes(changes.slice(0, 2), 0);

            if (changes[3]) {
                expectRevertedTimes([changes[3]], 1);
            }
        });
    });

    function getMockedChange(): RevertiblePageChangeMock | undefined {
        changes.push(new RevertiblePageChangeMock());

        return changes.at(-1);
    }

    function expectRevertedTimes(testedChanges: RevertiblePageChangeMock[], times: number) {
        for (const change of testedChanges) {
            expect(change.revert).toHaveBeenCalledTimes(times);
        }
    }

    function expectPageServiceSetMeta(expectedTags: { [name: string]: string }) {
        const names = Object.keys(expectedTags);
        names.forEach((n) => expect(pageServiceMock.setMeta).toHaveBeenCalledWith(n, expectedTags[n]));
        expect(pageServiceMock.setMeta).toHaveBeenCalledTimes(names.length);
    }
});
