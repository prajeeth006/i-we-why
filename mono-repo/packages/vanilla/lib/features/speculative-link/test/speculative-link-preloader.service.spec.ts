import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Route, Router, RouterPreloader, Routes, UrlSegment, provideRouter, withPreloading } from '@angular/router';

import { TimerService } from '@frontend/vanilla/core';

import { PrefetchRegistry } from '../src/prefetch-registry.service';
import { SpeculativeLinkPreloader } from '../src/speculative-link-preloader.service';

@Component({
    template: '',
    standalone: true,
})
class DummyComponent {}

const STATIC_LAZY_ROUTE = {
    path: 'lazy',
    loadComponent: () => Promise.resolve(DummyComponent),
};

const preResolverFnSpy = jasmine.createSpy();

const STATIC_LAZY_ROUTE_WITH_PRE_RESOLVER = {
    path: 'lazy-with-pre-resolver',
    loadComponent: () => Promise.resolve(DummyComponent),
    data: {
        preResolve: preResolverFnSpy,
    },
};

const DUMMY_MATCHER_PATTEN = '__MATCHER_PATTERN__';

const MATCHER_LAZY_ROUTE = {
    matcher: (segments: UrlSegment[]) => (segments.find((u) => u.path === DUMMY_MATCHER_PATTEN) ? { consumed: segments } : null),
    loadComponent: () => Promise.resolve(DummyComponent),
};

const ROUTE_WITH_EMPTRY_PATH_AND_PRE_RESOLVER = {
    path: '',
    loadComponent: () => Promise.resolve(DummyComponent),
    data: {
        preResolve: preResolverFnSpy,
    },
};

const ROUTE_EMPTY_SIBLING: Route = {
    path: 'empty_child',
    children: [ROUTE_WITH_EMPTRY_PATH_AND_PRE_RESOLVER, STATIC_LAZY_ROUTE_WITH_PRE_RESOLVER],
};

const ROUTES: Routes = [
    {
        path: 'root',
        children: [
            { path: 'eager', component: DummyComponent },
            STATIC_LAZY_ROUTE,
            STATIC_LAZY_ROUTE_WITH_PRE_RESOLVER,
            MATCHER_LAZY_ROUTE,
            ROUTE_EMPTY_SIBLING,
        ],
    },
];

describe('SpeculativeLinkPreloader', () => {
    let router: Router;
    let loader: RouterPreloader;
    let registry: PrefetchRegistry;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideRouter(ROUTES, withPreloading(SpeculativeLinkPreloader))],
        }).overrideProvider(TimerService, { useValue: { scheduleIdleCallback: (cb: () => void) => cb() } });

        router = TestBed.inject(Router);
        loader = TestBed.inject(RouterPreloader);
        registry = TestBed.inject(PrefetchRegistry);

        spyOn(registry, 'registerRoutes').and.callThrough();
        preResolverFnSpy.calls.reset();
    });

    it('should preload lazy route', async () => {
        registry.add(router.parseUrl('root/lazy'));

        await preloadComplete();

        expect(registry.registerRoutes).toHaveBeenCalledOnceWith(jasmine.objectContaining({ ...STATIC_LAZY_ROUTE }));
    });

    it('should preload lazy parent', async () => {
        registry.add(router.parseUrl('root/lazy/child'));

        await preloadComplete();

        expect(registry.registerRoutes).toHaveBeenCalledOnceWith(jasmine.objectContaining({ ...STATIC_LAZY_ROUTE }));
    });

    it('should preload matcher route if url matches pattern', async () => {
        registry.add(router.parseUrl(`root/${DUMMY_MATCHER_PATTEN}`));

        await preloadComplete();

        expect(registry.registerRoutes).toHaveBeenCalledOnceWith(jasmine.objectContaining({ ...MATCHER_LAZY_ROUTE }));
    });

    it('should preload lazy routes only once', async () => {
        registry.add(router.parseUrl('root/lazy'));
        await preloadComplete();
        registry.add(router.parseUrl('root/lazy/child'));
        await preloadComplete();

        expect(registry.registerRoutes).toHaveBeenCalledOnceWith(jasmine.objectContaining({ ...STATIC_LAZY_ROUTE }));
    });

    // This is currently disabled as it is over fetching. We are investigating a fix that does not under fetch
    // eslint-disable-next-line jest/no-test-prefixes
    xit('should not preload sibling routes with empty paths', async () => {
        registry.add(router.parseUrl('root/empty_child/lazy-with-pre-resolver'));

        await preloadComplete();

        expect(registry.registerRoutes).toHaveBeenCalledOnceWith(jasmine.objectContaining({ ...STATIC_LAZY_ROUTE_WITH_PRE_RESOLVER }));
    });

    it('should run preResolvers', async () => {
        registry.add(router.parseUrl('root/lazy-with-pre-resolver'));

        await preloadComplete();

        expect(preResolverFnSpy).toHaveBeenCalledTimes(1);
    });

    it('should run parent preResolvers', async () => {
        registry.add(router.parseUrl('root/lazy-with-pre-resolver/child'));

        await preloadComplete();

        expect(preResolverFnSpy).toHaveBeenCalledTimes(1);
    });

    it('should not run empty sibling route preResolvers', async () => {
        registry.add(router.parseUrl('root/empty_child/lazy-with-pre-resolver'));

        await preloadComplete();

        expect(preResolverFnSpy).toHaveBeenCalledTimes(1);
    });

    it('should not accumulate preResolvers with same url', async () => {
        const link1 = router.parseUrl('root/lazy-with-pre-resolver');
        const link2 = router.parseUrl('root/lazy-with-pre-resolver');
        registry.add(link1);
        registry.add(link2);
        await preloadComplete();
        expect(preResolverFnSpy).toHaveBeenCalledTimes(1);

        preResolverFnSpy.calls.reset();

        registry.preResolve(link1);
        await preloadComplete();
        expect(preResolverFnSpy).toHaveBeenCalledTimes(0);
    });

    it('should remove trees', () => {
        const tree = router.parseUrl('root/lazy-with-pre-resolver');
        registry.add(tree);
        expect(registry.has(tree)).toEqual(true);
        registry.remove(tree);
        expect(registry.has(tree)).toEqual(false);
    });

    function preloadComplete(): Promise<void> {
        return new Promise((resolve) => loader.preload().subscribe({ complete: resolve }));
    }
});
