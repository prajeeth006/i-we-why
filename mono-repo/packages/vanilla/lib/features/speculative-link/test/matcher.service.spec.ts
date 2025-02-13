import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Route, Router, UrlSegment, provideRouter } from '@angular/router';

import { MatcherService } from '../src/matcher.service';

describe('MatcherService', () => {
    let matcherService: MatcherService;
    let router: Router;

    it('should match the given route', () => {
        testSetup([
            {
                path: 'root',
                children: [
                    {
                        path: 'feature',
                        testId: 'feature-route',
                        children: [
                            {
                                path: '',
                                testId: 'empty-child',
                                loadComponent: loadComponentMock,
                            },
                            {
                                path: 'section',
                                testId: 'feature-sub-route',
                                loadComponent: loadComponentMock,
                            },
                        ],
                    },
                ],
            },
        ]);

        expect(matches('feature-route', 'root/feature')).toEqual({});
        expect(matches('empty-child', 'root/feature')).toEqual({});

        // @TODO This is over fetching and needs to be fixed to return null
        expect(matches('empty-child', 'root/feature/section')).toEqual({});
        expect(matches('feature-sub-route', 'root/feature')).toEqual(null);
        expect(matches('feature-sub-route', 'root/feature/section')).toEqual({});
    });

    it('should return parameters from fragments', () => {
        testSetup([
            {
                path: 'base/:id',
                testId: 'base-route',
                loadComponent: loadComponentMock,
            },
            {
                path: 'root',
                testId: 'root',
                children: [
                    {
                        path: ':feature',
                        testId: 'feature',
                        children: [
                            {
                                path: ':sub',
                                testId: 'sub-route',
                                loadComponent: loadComponentMock,
                            },
                        ],
                    },
                ],
            },
        ]);

        expect(matches('base-route', 'base/1')).toEqual({ id: '1' });
        expect(matches('feature', 'root/value')).toEqual({ feature: 'value' });
        expect(matches('sub-route', 'root/parent/child')).toEqual({ feature: 'parent', sub: 'child' });
    });

    it('should return parameters from matchers', () => {
        testSetup([
            {
                path: 'root',
                testId: 'root',
                children: [
                    {
                        matcher: () => null,
                        testId: 'null-matcher',
                        loadComponent: loadComponentMock,
                    },
                    {
                        matcher: (url) => {
                            if (url[0]?.path.match(/^@[\w]+$/gm)) {
                                return { consumed: url, posParams: { username: new UrlSegment(url[0].path.slice(1), {}) } };
                            }
                            return null;
                        },
                        testId: '@-matcher',
                        children: [
                            {
                                path: 'child',
                                testId: 'child-route',
                                loadComponent: loadComponentMock,
                            },
                        ],
                    },
                    {
                        path: 'static',
                        testId: 'static-route',
                        loadComponent: loadComponentMock,
                    },
                ],
            },
        ]);

        expect(matches('null-matcher', 'root/dummy')).toEqual(null);
        expect(matches('@-matcher', 'root/@angular')).toEqual({ username: 'angular' });
        expect(matches('child-route', 'root/@angular/child')).toEqual({ username: 'angular' });
        expect(matches('static-route', 'root/static')).toEqual({});
    });

    function testSetup(routes: TestRoutes) {
        TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
        matcherService = TestBed.inject(MatcherService);
        router = TestBed.inject(Router);
    }

    function matches(routeTestId: string, link: string) {
        const testRoute = routeFinderHelper(routeTestId);
        const routeTree = matcherService.getExtendedTree(testRoute);
        return matcherService.getMatches(routeTree, router.parseUrl(link));
    }

    function routeFinderHelper(testId: string): TestRoute {
        const stack: TestRoutes = [...router.config];

        while (stack.length) {
            const current = stack.pop()!;
            if (current.testId === testId) {
                return current;
            }
            if (current.children?.length) {
                stack.push(...current.children);
            }
        }
        throw Error(`Error in test configuration, trying to find a route which is not configured ${testId}`);
    }
});

interface TestRoute extends Route {
    children?: TestRoute[] | Route[];
    testId?: string;
}
type TestRoutes = TestRoute[];

@Component({
    template: ``,
    standalone: true,
})
export class DummyComponent {}

function mockLoaderFn<T>(component: T): () => Promise<T> {
    return () => Promise.resolve(component);
}

const loadComponentMock = mockLoaderFn(DummyComponent);
