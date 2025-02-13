import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TestBed } from '@angular/core/testing';

import { VanillaElements } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { DeviceServiceMock } from '../../../core/test/browser/device.mock';
import { HtmlNodeMock } from '../../../core/test/browser/html-node.mock';
import { MediaQueryServiceMock } from '../../../core/test/browser/media-query.service.mock';
import { ElementRepositoryServiceMock } from '../../../core/test/browsercommon/element-repository.mock';
import { HtmlElementMock } from '../../../core/test/element-ref.mock';
import { MockPositionStrategies, OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { OverlayFactoryMock } from '../../../shared/overlay-factory/test/overlay-factory.mock';
import { DomChangeServiceMock } from '../../account-menu/test/dom-change.mock';
import { QuickDepositOverlayService } from '../src/quick-deposit/quick-deposit-overlay.service';
import { QuickDepositResponsiveComponent } from '../src/quick-deposit/quick-deposit-responsive.component';
import { CashierConfigMock } from './cashier.mock';

describe('QuickDepositOverlayService', () => {
    let service: QuickDepositOverlayService;
    let overlayMock: OverlayFactoryMock;
    let mediaMock: MediaQueryServiceMock;
    let elementRepositoryServiceMock: ElementRepositoryServiceMock;
    let domChangeServiceMock: DomChangeServiceMock;
    let overlayRef: OverlayRefMock;
    let fakeAnchorElement: HtmlElementMock;
    let fakeCustomAnchorElement: HtmlElementMock;
    let fakeAuthHeaderSection: HtmlElementMock;
    let htmlNodeMock: HtmlNodeMock;
    let deviceServiceMock: DeviceServiceMock;

    beforeEach(() => {
        overlayMock = MockContext.useMock(OverlayFactoryMock);
        mediaMock = MockContext.useMock(MediaQueryServiceMock);
        elementRepositoryServiceMock = MockContext.useMock(ElementRepositoryServiceMock);
        domChangeServiceMock = MockContext.useMock(DomChangeServiceMock);
        htmlNodeMock = MockContext.useMock(HtmlNodeMock);
        deviceServiceMock = MockContext.useMock(DeviceServiceMock);
        MockContext.useMock(CashierConfigMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, QuickDepositOverlayService],
        });

        overlayRef = new OverlayRefMock();
        overlayMock.create.and.returnValue(overlayRef);

        fakeAnchorElement = new HtmlElementMock();
        fakeCustomAnchorElement = new HtmlElementMock();
        fakeAuthHeaderSection = new HtmlElementMock();

        elementRepositoryServiceMock = MockContext.useMock(ElementRepositoryServiceMock);
        elementRepositoryServiceMock.get.withArgs(VanillaElements.DEPOSIT_BUTTON_ANCHOR).and.returnValue(fakeAnchorElement);
        elementRepositoryServiceMock.get.withArgs(VanillaElements.AUTH_HEADER_SECTION).and.returnValue(fakeAuthHeaderSection);
        elementRepositoryServiceMock.get.withArgs('customAnchor').and.returnValue(fakeCustomAnchorElement);

        service = TestBed.inject(QuickDepositOverlayService);
    });

    describe('common', () => {
        describe('toggle', () => {
            it('should create an overlay', () => {
                service.show({});

                const expectedConfig = {
                    backdropClass: 'lh-backdrop',
                    panelClass: ['lh-quick-deposit-container'],
                    scrollStrategy: 'noop',
                    positionStrategy: new MockPositionStrategies(),
                };
                expectedConfig.positionStrategy.position = 'gt';

                expect(overlayMock.create).toHaveBeenCalledWith(expectedConfig);
                expect(overlayRef.attach).toHaveBeenCalled();
                const portal: ComponentPortal<QuickDepositResponsiveComponent> = overlayRef.attach.calls.mostRecent().args[0];
                expect(portal.component).toBe(QuickDepositResponsiveComponent);
                expect(portal.injector!.get(OverlayRef)).toBe(<any>overlayRef);
                expect(htmlNodeMock.blockScrolling).toHaveBeenCalledWith(true);

                overlayRef.backdropClick.next();
                deviceServiceMock.isMobilePhone = true;

                service.show({});
                expect(overlayMock.create).toHaveBeenCalledWith(expectedConfig);
            });

            it('should add drawer for version 2 and mobile phone', () => {
                deviceServiceMock.isMobilePhone = true;
                service.show({});

                const expectedConfig = {
                    backdropClass: 'lh-backdrop',
                    panelClass: ['lh-quick-deposit-container', 'generic-modal-drawer'],
                    scrollStrategy: 'noop',
                    positionStrategy: new MockPositionStrategies(),
                };
                expectedConfig.positionStrategy.position = 'gt';

                expect(overlayMock.create).toHaveBeenCalledWith(expectedConfig);
            });

            it('should position overlay to anchor on big screens', () => {
                mediaMock.isActive.withArgs('gt-sm').and.returnValue(true);

                service.show({});

                expect(overlayMock.create).toHaveBeenCalled();
                const overlayOptions = overlayMock.create.calls.mostRecent().args[0];

                expect(overlayOptions.positionStrategy.position).toBe('f');
                expect(overlayOptions.positionStrategy.anchor).toBe(fakeAnchorElement);
            });

            it('should detach overlay on backdrop click', () => {
                service.show({});

                overlayRef.backdropClick.next();

                expect(overlayRef.detach).toHaveBeenCalled();
            });

            it('should dispose after detached and remove cdk-global-scrollblock from html tag', () => {
                htmlNodeMock.hasBlockScrolling.and.returnValue(false);
                service.show({});

                expect(htmlNodeMock.blockScrolling).toHaveBeenCalledWith(true);

                overlayRef.detachments.next();

                expect(overlayMock.dispose).toHaveBeenCalledWith(overlayRef);
                expect(htmlNodeMock.blockScrolling).toHaveBeenCalledWith(false);
            });

            it('should not remove cdk-global-scrollblock from html tag if it is was added by other component', () => {
                htmlNodeMock.hasBlockScrolling.and.returnValue(true);
                service.show({});

                expect(htmlNodeMock.blockScrolling).toHaveBeenCalledWith(true);

                overlayRef.detachments.next();

                expect(htmlNodeMock.blockScrolling.calls.count()).toBe(1);
            });

            it('should not create an overlay if one is already open', () => {
                service.show({});
                service.show({});

                expect(overlayMock.create).toHaveBeenCalledTimes(1);
            });

            it('should allow to open an overlay after first one is closed', () => {
                service.show({});

                overlayRef.detachments.next();
                service.show({});

                expect(overlayMock.create).toHaveBeenCalledTimes(2);
            });
        });

        describe('media change', () => {
            let isDesktop: boolean;

            beforeEach(() => {
                isDesktop = false;
                mediaMock.isActive.withArgs('gt-sm').and.callFake(() => isDesktop);
            });

            it('should update overlay position if changed to large screen from small screen while quick deposit is open', () => {
                service.show({});

                isDesktop = true;

                overlayMock.position.position = '';
                mediaMock.observe.next();

                expect(overlayRef.updatePositionStrategy).toHaveBeenCalledWith(
                    jasmine.objectContaining({
                        position: 'f',
                        anchor: fakeAnchorElement,
                    }),
                );
            });

            it('should update overlay position if changed to small screen from large screen while quick deposit is open', () => {
                isDesktop = true;
                service.show({});

                const overlayOptions = overlayMock.create.calls.mostRecent().args[0];
                expect(overlayOptions.positionStrategy.position).toBe('f');
                isDesktop = false;

                overlayMock.position.position = '';
                mediaMock.observe.next();

                expect(overlayRef.updatePositionStrategy).toHaveBeenCalledWith(jasmine.objectContaining({ position: 'gt' }));
            });

            it('should not reposition overlay if its not open in the first place', () => {
                expect(mediaMock.observe).not.toHaveBeenCalled();

                service.show({});
                overlayRef.detachments.next();

                mediaMock.observe.next();

                expect(overlayRef.updatePositionStrategy).not.toHaveBeenCalled();
            });

            it('should update overlay position if an anchor is recreated while quick deposit is open in large screen', () => {
                isDesktop = true;
                service.show({});

                expect(domChangeServiceMock.observe).toHaveBeenCalledWith(fakeAuthHeaderSection);

                const newAnchor = new HtmlElementMock();
                elementRepositoryServiceMock.get.withArgs(VanillaElements.DEPOSIT_BUTTON_ANCHOR).and.returnValue(newAnchor);

                overlayMock.position.position = '';
                domChangeServiceMock.observe.next({
                    addedNodes: [
                        {
                            nodeType: 1,
                            innerHTML: '<div class="deposit-button-anchor></div>"',
                        },
                    ],
                });

                expect(overlayRef.updatePositionStrategy).toHaveBeenCalledWith(
                    jasmine.objectContaining({
                        position: 'f',
                        anchor: newAnchor,
                    }),
                );
            });

            it('should not update overlay position if an anchor is recreated while quick deposit is open in small screen', () => {
                service.show({});

                expect(domChangeServiceMock.observe).toHaveBeenCalledWith(fakeAuthHeaderSection);

                domChangeServiceMock.observe.next({
                    addedNodes: [
                        {
                            nodeType: 1,
                            innerHTML: '<div class="deposit-button-anchor></div>"',
                        },
                    ],
                });

                expect(overlayRef.updatePositionStrategy).not.toHaveBeenCalled();
            });
        });
    });
});
