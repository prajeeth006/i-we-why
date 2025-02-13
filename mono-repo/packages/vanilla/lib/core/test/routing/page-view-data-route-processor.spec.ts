import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { PageViewDataRouteProcessor } from '../../src/routing/route-processor';

describe('PageViewDataRouteProcessor', () => {
    let processor: PageViewDataRouteProcessor;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MockContext.providers, PageViewDataRouteProcessor],
        });

        processor = TestBed.inject(PageViewDataRouteProcessor);
    });

    it('should set waitForPageViewData data property for components that provide page view data', () => {
        const route = { path: 'path', component: <any>{ ProvidesPageViewData: true } };

        const result = processor.process(route);

        expect(result).toEqual({ path: 'path', component: <any>{ ProvidesPageViewData: true }, data: { waitForPageViewData: true } });
    });
});
