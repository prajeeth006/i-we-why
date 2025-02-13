import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { GracePeriodUnit, UserDocumentsComponent, VerificationUseCase } from '@frontend/vanilla/features/user-documents';
import { MockContext } from 'moxxi';

import { TrackingServiceMock } from '../../../core/src/tracking/test/tracking.mock';
import { BalancePropertiesServiceMock } from '../../balance-properties/test/balance-properties.service.mock';
import { KycStatusServiceMock } from '../../kyc/test/kyc.mocks';
import { SofStatusDetailsServiceMock } from '../../sof-status-details/test/sof-status.mock';
import { UserDocumentsConfigMock } from './user-documents-config.mock';

describe('UserDocumentsComponent', () => {
    let fixture: ComponentFixture<UserDocumentsComponent>;
    let component: UserDocumentsComponent;
    let trackingServiceMock: TrackingServiceMock;
    let kycStatusServiceMock: KycStatusServiceMock;

    beforeEach(() => {
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);
        kycStatusServiceMock = MockContext.useMock(KycStatusServiceMock);
        MockContext.useMock(SofStatusDetailsServiceMock);
        MockContext.useMock(UserDocumentsConfigMock);
        MockContext.useMock(BalancePropertiesServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
        });

        fixture = TestBed.createComponent(UserDocumentsComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('item', {
            trackEvent: { eventName: 'document' },
            children: [{ name: 'empty', text: 'document', resources: { Status: 'No documents to show' } }],
            resources: { LimitNotice: 'limit' },
        });
        fixture.componentRef.setInput('userDocuments', {
            documentVerificationStatus: [
                {
                    documentDetails: [],
                    useCase: VerificationUseCase.Kyc,
                    isVerified: false,
                },
            ],
        });
        fixture.detectChanges();
    });

    describe('ngOnInit', () => {
        it('should track', () => {
            expect(trackingServiceMock.trackContentItemEvent).toHaveBeenCalledWith({ eventName: 'document' }, 'LoadedEvent');
        });

        it('should update kycStatus', fakeAsync(() => {
            kycStatusServiceMock.kycStatus.next(<any>{ kycVerified: true });
            tick();

            expect(component.kycStatus()).toEqual(<any>{ kycVerified: true, graceDaysUnit: GracePeriodUnit.Days });
        }));
    });

    describe('ngOnDestroy', () => {
        it('should unsubscribe', fakeAsync(() => {
            fixture.destroy();

            kycStatusServiceMock.kycStatus.next(<any>{});
            tick();

            expect(component.kycStatus()).toBeNull();
        }));
    });

    describe('getTemplate', () => {
        it('should return menu item', () => {
            const template = component.getTemplate('empty');
            expect(template?.text).toBe('document');
        });
    });
});
