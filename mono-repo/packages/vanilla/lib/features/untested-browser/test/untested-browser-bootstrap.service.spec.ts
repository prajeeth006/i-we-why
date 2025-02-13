import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { ToastrQueueServiceMock } from '../../../core/test/toastr/toastr-queue.mock';
import { UntestedBrowserBootstrapService } from '../src/untested-browser-bootstrap.service';

describe('UntestedBrowserBootstrapService', () => {
    let service: UntestedBrowserBootstrapService;
    let toastrQueueServiceMock: ToastrQueueServiceMock;

    beforeEach(() => {
        toastrQueueServiceMock = MockContext.useMock(ToastrQueueServiceMock);

        TestBed.configureTestingModule({
            providers: [UntestedBrowserBootstrapService, MockContext.providers],
        });

        service = TestBed.inject(UntestedBrowserBootstrapService);
    });

    describe('onFeatureInit()', () => {
        it('should add updatebrowser toast', () => {
            service.onFeatureInit();

            expect(toastrQueueServiceMock.add).toHaveBeenCalledWith('updatebrowser');
        });
    });
});
