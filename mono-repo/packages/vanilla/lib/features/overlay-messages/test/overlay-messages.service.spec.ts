import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TestBed } from '@angular/core/testing';

import { ContentItem } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';
import { Subject, of } from 'rxjs';

import { DslServiceMock } from '../../../core/test/dsl/dsl.mock';
import { MockPositionStrategies, OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { OverlayFactoryMock } from '../../../shared/overlay-factory/test/overlay-factory.mock';
import { ContentMessagesServiceMock } from '../../content-messages/test/content-messages.mock';
import { OVERLAY_MESSAGES_CONTENT, OverlayMessagesComponent } from '../src/overlay-messages.component';
import { OverlayMessagesService } from '../src/overlay-messages.service';

describe('OverlayMessagesService', () => {
    let service: OverlayMessagesService;
    let contentMessagesServiceMock: ContentMessagesServiceMock;
    let dslServiceMock: DslServiceMock;
    let contentStream: Subject<ContentItem[]>;
    let overlayMock: OverlayFactoryMock;

    beforeEach(() => {
        overlayMock = MockContext.useMock(OverlayFactoryMock);
        contentMessagesServiceMock = MockContext.useMock(ContentMessagesServiceMock);
        dslServiceMock = MockContext.useMock(DslServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, OverlayMessagesService],
        });

        contentStream = new Subject();
        contentMessagesServiceMock.getMessages.and.returnValue(of([{}]));
        dslServiceMock.evaluateContent.and.returnValue(contentStream);
        contentMessagesServiceMock.getClosedMessageNames.withArgs('m2').and.returnValue(['closed']);

        service = TestBed.inject(OverlayMessagesService);
    });

    describe('showOverlayMessages', () => {
        let overlayRef: OverlayRefMock;

        beforeEach(() => {
            overlayRef = new OverlayRefMock();
            overlayMock.create.and.returnValue(overlayRef);
        });

        it('should open an overlay', () => {
            service.showOverlayMessages();
            contentStream.next([{ name: 'msg' } as ContentItem, { name: 'closed' } as ContentItem]);

            const expectedConfig = {
                panelClass: 'vn-overlay-messages-container',
                positionStrategy: new MockPositionStrategies(),
            };
            expectedConfig.positionStrategy.position = 'gcht';

            expect(overlayMock.create).toHaveBeenCalledWith(expectedConfig);
            expect(overlayRef.attach).toHaveBeenCalled();
            const portal: ComponentPortal<OverlayMessagesComponent> = overlayRef.attach.calls.mostRecent().args[0];
            expect(portal.component).toBe(OverlayMessagesComponent);
            expect(portal.injector!.get(OverlayRef)).toBe(<any>overlayRef);
            const spy = jasmine.createSpy();
            portal.injector!.get(OVERLAY_MESSAGES_CONTENT).subscribe(spy);
            expect(spy).toHaveBeenCalledWith([{ name: 'msg' }]);
        });

        it('should close overlay if its open and all messages are filtered out and open it if messages are added', () => {
            service.showOverlayMessages();
            const content = [{ name: 'msg' } as ContentItem];
            contentStream.next(content);

            expect(overlayMock.create).toHaveBeenCalled();

            contentStream.next([]);

            expect(overlayMock.dispose).toHaveBeenCalledWith(overlayRef);

            // should not close if its not open
            overlayRef.dispose.calls.reset();
            contentStream.next([]);
            expect(overlayRef.dispose).not.toHaveBeenCalled();

            // should appear again if messages are filtered in
            overlayMock.create.calls.reset();
            contentStream.next(content);
            expect(overlayMock.create).toHaveBeenCalled();
        });

        it('should not open an overlay if there are no messages to show', () => {
            contentStream.next([]);

            service.showOverlayMessages();

            expect(overlayMock.create).not.toHaveBeenCalled();
        });
    });
});
