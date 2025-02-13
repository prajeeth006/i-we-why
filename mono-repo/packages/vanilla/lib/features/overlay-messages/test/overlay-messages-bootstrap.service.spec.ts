import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { OverlayMessagesBootstrapService } from '../src/overlay-messages-bootstrap.service';
import { OverlayMessagesServiceMock } from './overlay-messages.mock';

describe('OverlayMessagesBootstrapService', () => {
    let service: OverlayMessagesBootstrapService;
    let contentMessagesServiceMock: OverlayMessagesServiceMock;

    beforeEach(() => {
        contentMessagesServiceMock = MockContext.useMock(OverlayMessagesServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, OverlayMessagesBootstrapService],
        });

        service = TestBed.inject(OverlayMessagesBootstrapService);
    });

    describe('run()', () => {
        it('should show overlay messages', () => {
            service.onFeatureInit();

            expect(contentMessagesServiceMock.showOverlayMessages).toHaveBeenCalled();
        });
    });
});
