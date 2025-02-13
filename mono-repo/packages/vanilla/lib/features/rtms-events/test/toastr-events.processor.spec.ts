import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { EventType, RtmsType } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { IntlServiceMock } from '../../../core/test/intl/intl.mock';
import { ToastrQueueServiceMock } from '../../../core/test/toastr/toastr-queue.mock';
import { ToastrEventsProcessor } from '../src/toastr-events-processor';
import { RtmsEventsConfigMock } from './rtms-events.mocks';

describe('ToastrEventsProcessor', () => {
    let service: ToastrEventsProcessor;
    let toastrQueueServiceMock: ToastrQueueServiceMock;
    let configMock: RtmsEventsConfigMock;
    let intlServiceMock: IntlServiceMock;

    beforeEach(() => {
        toastrQueueServiceMock = MockContext.useMock(ToastrQueueServiceMock);
        configMock = MockContext.useMock(RtmsEventsConfigMock);
        intlServiceMock = MockContext.useMock(IntlServiceMock);

        TestBed.configureTestingModule({
            providers: [ToastrEventsProcessor, MockContext.providers],
        });

        configMock.rtmsEventToToastr = {
            de_annual_kyc_verified_event: {
                name: 'GermanAnnualKycVerifiedSuccess',
                schedule: 'afterNextNavigation',
            },
            kyc_verified_event_rmp: {
                name: 'KycVerifiedSuccess',
                schedule: 'immediate',
                placeholders: {
                    lastname: {
                        propertyName: 'surName',
                    },
                    balance: {
                        propertyName: 'Balance',
                        format: 'number',
                        parameters: {
                            digitsInfo: '1.0.-0',
                        },
                    },
                    currency: {
                        propertyName: 'value',
                        format: 'currency',
                        parameters: {
                            digitsInfo: '1.0',
                            currencyCode: 'EUR',
                        },
                    },
                    birthday: {
                        propertyName: 'year',
                        format: 'date',
                        parameters: {
                            dateFormat: 'long',
                            timezone: 'CETTT',
                        },
                    },
                    test: {
                        propertyName: 'aaaa',
                    },
                },
            },
            no_schedule: {
                name: 'WrongSchedule',
                schedule: 'false',
            },
            test: {
                name: 'test',
                schedule: 'immediate',
            },
        };
        intlServiceMock.formatNumber.and.returnValue('566');
        intlServiceMock.formatCurrency.and.returnValue('512 EUR');
        intlServiceMock.formatDate.and.returnValue('28.12.2023');
    });

    beforeEach(() => {
        service = TestBed.inject(ToastrEventsProcessor);
    });

    it('should process', fakeAsync(() => {
        service.process({ name: RtmsType.BALANCE_UPDATE, type: EventType.Rtms, data: {} });
        service.process({ name: RtmsType.KYC_VERIFIED_EVENT, type: EventType.Rtms, data: {} });
        service.process({ name: RtmsType.KYC_REFRESH_TRIGGER_EVENT, type: EventType.Rtms, data: {} });
        service.process({
            name: RtmsType.KYC_VERIFIED_EVENT_RMP,
            type: EventType.Rtms,
            data: { surName: 'Wayne', Balance: 564, value: 656, year: '28/12/2023' },
        });
        service.process({ name: RtmsType.DE_ANNUAL_KYC_VERIFIED_EVENT, type: EventType.Rtms, data: {} });
        service.process({ name: 'NO_SCHEDULE', type: EventType.Rtms, data: {} });

        configMock.whenReady.next();
        tick();

        expect(toastrQueueServiceMock.add).toHaveBeenCalledWith('KycVerifiedSuccess', {
            schedule: 'immediate',
            placeholders: { lastname: 'Wayne', balance: '566', currency: '512 EUR', birthday: '28.12.2023' },
        });
        expect(intlServiceMock.formatNumber).toHaveBeenCalledWith(564, '1.0.-0');
        expect(intlServiceMock.formatCurrency).toHaveBeenCalledWith(656, 'EUR', '1.0');
        expect(intlServiceMock.formatDate).toHaveBeenCalledWith('28/12/2023', 'long', 'CETTT');
        expect(toastrQueueServiceMock.add).toHaveBeenCalledWith('GermanAnnualKycVerifiedSuccess', {
            schedule: 'afterNextNavigation',
            placeholders: {},
        });
        expect(toastrQueueServiceMock.add).toHaveBeenCalledWith('WrongSchedule', {
            schedule: 'immediate',
            placeholders: {},
        });
    }));
});
