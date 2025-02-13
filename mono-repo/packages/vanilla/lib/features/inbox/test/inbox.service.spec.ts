import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentFactoryResolver } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { VanillaEventNames } from '../../../core/src/utils/events.service';
import { EventsServiceMock } from '../../../core/src/utils/test/utils.mock';
import { DateTimeServiceMock } from '../../../core/test/browser/datetime.service.mock';
import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { OverlayFactoryMock } from '../../../shared/overlay-factory/test/overlay-factory.mock';
import { HeaderBarServiceMock } from '../../header-bar/test/header-bar.mocks';
import { INBOX_DATA, InboxOverlayComponent } from '../src/components/inbox-overlay.component';
import { InboxService } from '../src/services/inbox.service';
import { InboxConfigMock } from './inbox.client-config.mock';
import { InboxCountServiceMock, InboxDataServiceMock, InboxTrackingServiceMock } from './inbox.mocks';

describe('InboxService', () => {
    let service: InboxService;
    let inboxTrackingServiceMock: InboxTrackingServiceMock;
    let inboxDataServiceMock: InboxDataServiceMock;
    let overlayMock: OverlayFactoryMock;
    let inboxConfigMock: InboxConfigMock;
    let dateTimeServiceMock: DateTimeServiceMock;
    let overlayRef: OverlayRefMock;
    let inboxCountServiceMock: InboxCountServiceMock;
    let headerBarServiceMock: HeaderBarServiceMock;
    let eventsServiceMock: EventsServiceMock;

    beforeEach(() => {
        inboxCountServiceMock = MockContext.useMock(InboxCountServiceMock);
        inboxTrackingServiceMock = MockContext.useMock(InboxTrackingServiceMock);
        inboxDataServiceMock = MockContext.useMock(InboxDataServiceMock);
        overlayMock = MockContext.useMock(OverlayFactoryMock);
        inboxConfigMock = MockContext.useMock(InboxConfigMock);
        dateTimeServiceMock = MockContext.useMock(DateTimeServiceMock);
        headerBarServiceMock = MockContext.useMock(HeaderBarServiceMock);
        eventsServiceMock = MockContext.useMock(EventsServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, ComponentFactoryResolver, InboxService],
        });

        service = TestBed.inject(InboxService);

        overlayRef = new OverlayRefMock();
        overlayMock.create.and.returnValue(overlayRef);
        dateTimeServiceMock.now.and.returnValue(new Date(1576775885265));
    });

    describe('isEnabled', () => {
        it('should be true', () => {
            expect(service.isEnabled).toBeTrue();
        });
    });

    describe('count', () => {
        it('should proxy to count service', () => {
            const spy = jasmine.createSpy();
            service.count.subscribe(spy);

            inboxCountServiceMock.count.next(2);

            expect(spy).toHaveBeenCalledWith(2);
        });
    });

    describe('getCount()', () => {
        it('should return current count', () => {
            inboxCountServiceMock.count.next(2);

            expect(service.getCount()).toBe(2);
        });
    });

    describe('open()', () => {
        it('should create an overlay', () => {
            service.open({ showBackButton: true, trackingEventName: 'track' });

            const expectedConfig = {
                panelClass: 'vn-inbox',
            };

            expect(overlayMock.create).toHaveBeenCalledWith(expectedConfig);
            expect(overlayRef.attach).not.toHaveBeenCalled();
            inboxDataServiceMock.getContent.next();
            inboxConfigMock.whenReady.next();
            expect(overlayRef.attach).toHaveBeenCalled();

            const portal: ComponentPortal<InboxOverlayComponent> = overlayRef.attach.calls.mostRecent().args[0];
            expect(portal.component).toBe(InboxOverlayComponent);
            expect(portal.injector!.get(OverlayRef)).toBe(<any>overlayRef);
            expect(portal.injector!.get(INBOX_DATA)).toEqual({ showBackButton: true });

            inboxCountServiceMock.count.next(2);
            expect(inboxTrackingServiceMock.trackInboxOpened).toHaveBeenCalledWith({
                eventName: 'track',
                newMessagesCount: 2,
            });
        });

        it('should not create an overlay if one is already open', () => {
            service.open({ showBackButton: true });
            service.open({ showBackButton: true });

            expect(overlayMock.create).toHaveBeenCalledTimes(1);
            expect(eventsServiceMock.raise).toHaveBeenCalledWith({ eventName: VanillaEventNames.InboxOpen });
        });

        it('should allow to open an overlay after first one is closed', () => {
            service.open({ showBackButton: true });
            overlayRef.detachments.next();
            service.open({ showBackButton: true });

            expect(overlayMock.create).toHaveBeenCalledTimes(2);
        });

        it('should detach overlay on backdrop click', () => {
            service.open({ showBackButton: true });

            overlayRef.backdropClick.next();

            expect(overlayRef.detach).toHaveBeenCalled();
        });

        it('should should dispose after detached', () => {
            service.open({ showBackButton: true });

            overlayRef.detachments.next();

            expect(overlayMock.dispose).toHaveBeenCalledWith(overlayRef);
        });
    });

    describe('close()', () => {
        it('should detach overlay when closed', () => {
            service.open({ showBackButton: true });
            service.close();

            expect(overlayRef.detach).toHaveBeenCalled();
            expect(eventsServiceMock.raise).toHaveBeenCalledWith({ eventName: VanillaEventNames.InboxClose });
        });

        it('should call back method from InboxService when currentRef', () => {
            overlayMock.overlayRefs = new Map();
            service.close();

            expect(headerBarServiceMock.back).toHaveBeenCalled();
        });

        it('should notify when overlay is not visible', () => {
            const spy = jasmine.createSpy();
            service.state.subscribe(spy);

            service.open({ showBackButton: true });
            service.close();
            overlayRef.detachments.next();

            expect(spy).toHaveBeenCalledWith({ isOpen: false });
        });

        it('should notify when state changes', () => {
            const spy = jasmine.createSpy();
            service.state.subscribe(spy);

            service.open({ showBackButton: true });
            service.close();
            overlayRef.detachments.next();

            expect(spy).toHaveBeenCalledWith({ isOpen: false });
        });

        it('should notify when state changes with source', () => {
            const spy = jasmine.createSpy();
            service.state.subscribe(spy);

            service.open({ showBackButton: true });
            service.close('back');
            overlayRef.detachments.next();
            expect(spy).toHaveBeenCalledWith({ isOpen: false, changeSource: 'back' });
        });

        it('should track if it was closed within 1 sec', () => {
            service.open({ showBackButton: true });
            overlayRef.attachments.next();

            dateTimeServiceMock.now.and.returnValue(new Date(1576775885565));
            overlayRef.detachments.next();

            expect(inboxTrackingServiceMock.trackInboxClosedEarly).toHaveBeenCalled();
        });

        it('should not track if it was closed after 1 sec', () => {
            service.open({ showBackButton: true });
            overlayRef.attachments.next();

            dateTimeServiceMock.now.and.returnValue(new Date(1576775886565));
            overlayRef.detachments.next();

            expect(inboxTrackingServiceMock.trackInboxClosedEarly).not.toHaveBeenCalled();
        });
    });
});
