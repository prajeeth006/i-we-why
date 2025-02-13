import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { PathPlaceholdersRouteProcessor } from '../../src/routing/route-processor';
import { PageMock } from '../browsercommon/page.mock';

describe('PathPlaceholdersRouteProcessor', () => {
    let processor: PathPlaceholdersRouteProcessor;

    beforeEach(() => {
        MockContext.useMock(PageMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, PathPlaceholdersRouteProcessor],
        });

        processor = TestBed.inject(PathPlaceholdersRouteProcessor);
    });

    it('should replace culture in path', () => {
        const route = { path: '{culture}/path' };

        const result = processor.process(route);

        expect(result).toEqual({ path: 'en/path' });
    });

    it('should replace culture in redirectTo', () => {
        const route = { redirectTo: '{culture}/path' };

        const result = processor.process(route);

        expect(result).toEqual({ redirectTo: 'en/path' });
    });

    it('should replace culture in path multiple times', () => {
        const route = { path: '{culture}/path/{culture}' };

        const result = processor.process(route);

        expect(result).toEqual({ path: 'en/path/en' });
    });
});
