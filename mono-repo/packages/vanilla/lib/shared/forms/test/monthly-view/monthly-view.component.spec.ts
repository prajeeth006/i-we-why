import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';

import { WINDOW } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { DropdownValue, MonthlyViewComponent } from '@frontend/vanilla/shared/forms';
import { MockContext } from 'moxxi';
import { MockComponent } from 'ng-mocks';

import { WindowMock } from '../../../../core/src/browser/window/test/window-ref.mock';
import { VanillaApiServiceMock } from '../../../../core/src/http/test/vanilla-api.mock';
import { PageMock } from '../../../../core/test/browsercommon/page.mock';
import { IntlServiceMock } from '../../../../core/test/intl/intl.mock';
import { MessageQueueServiceMock } from '../../../../core/test/messages/message-queue.mock';

describe('MonthlyViewComponent', () => {
    let fixture: ComponentFixture<MonthlyViewComponent>;
    let component: MonthlyViewComponent;
    let messageQueueServiceMock: MessageQueueServiceMock;
    let windowMock: WindowMock;
    let additionalDropdownItem: any;
    let apiMock: VanillaApiServiceMock;
    let apiSuccessResponse: any;
    let scrollEvent: { fire: Function };

    const today = new Date();

    beforeEach(() => {
        messageQueueServiceMock = MockContext.useMock(MessageQueueServiceMock);
        windowMock = new WindowMock();
        MockContext.useMock(PageMock);

        apiMock = MockContext.createMock(VanillaApiServiceMock);
        MockContext.useMock(IntlServiceMock);

        apiSuccessResponse = {
            cashback: [
                {
                    claimedAmount: 100,
                    claimedAmountCurrency: 'EUR',
                },
            ],
            nextPage: -1,
        };

        additionalDropdownItem = {
            type: 1,
            text: 'summary',
            callbackShow: jasmine.createSpy('callbackShow'),
            callbackHide: jasmine.createSpy('callbackHide'),
        };

        windowMock.addEventListener.and.callFake((event: string, callback: Function) => {
            if (event === 'scroll') {
                scrollEvent = { fire: callback };
            }
        });

        TestBed.configureTestingModule({
            providers: [
                ...MockContext.providers,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        });
        TestBed.overrideComponent(MonthlyViewComponent, {
            remove: {
                imports: [IconCustomComponent],
            },
            add: {
                imports: [MockComponent(IconCustomComponent)],
            },
        });
    });

    function createComponent() {
        fixture = TestBed.createComponent(MonthlyViewComponent);
        component = fixture.componentInstance;
        component.content = { messages: { OlderEntries: 'older entries', NoEntriesFound: 'Notransaction {0}' } };
        component.api = apiMock as any;
    }

    it('should not be null', () => {
        createComponent();
        expect(component).not.toBeNull();
    });

    describe('ngOnInit()', () => {
        it('should setup properties', () => {
            createComponent();
            fixture.detectChanges();

            expect(component.content).toBeDefined();
            expect(component.loadingData).withContext('loadingData shall be set to true').toBeTrue();
            expect(component.displayMonthPagination).withContext('unexpected displayMonthPagination').toBeFalse();
        });

        it('should set itemsObj to empty object when not set', () => {
            createComponent();
            fixture.detectChanges();

            expect(component.itemsObj).not.withContext('itemsObj should be new object if not set').toBeNull();
        });

        it('should add all options to selectedPeriod (since 1996)', () => {
            createComponent();
            fixture.detectChanges();

            let expectedNumberOfOptions = (today.getFullYear() - 1996) * 12 + today.getMonth() + 1;
            expectedNumberOfOptions++; //+ 1 for older entries option

            expect(component.dropdownValues.length).withContext('unexpected number of options').toBe(expectedNumberOfOptions);
            expect(component.selectedPeriod?.month).withContext('unexpected option selected (month)').toBe(today.getMonth());
            expect(component.selectedPeriod?.year).withContext('unexpected option selected (year)').toBe(today.getFullYear());
        });

        it('should add all options to selectedPeriod limited by cutOffMonth, cutOffYear', () => {
            createComponent();
            component.cutOffYear = 2014;
            component.cutOffMonth = 3;
            fixture.detectChanges();

            let expectedNumberOfOptions = (today.getFullYear() - 2014) * 12 + today.getMonth() + 1 - (component.cutOffMonth + 1);
            expectedNumberOfOptions++; //+ 1 for older entries option

            expect(component.dropdownValues.length).withContext('unexpected number of options').toBe(expectedNumberOfOptions);
        });

        it('should add all options to selectedPeriod limited by dateCollectionLastYear', () => {
            createComponent();
            component.dateCollectionLastYear = 1999;
            fixture.detectChanges();

            let expectedNumberOfOptions = (today.getFullYear() - 1999) * 12 + today.getMonth() + 1;
            expectedNumberOfOptions++; //+ 1 for older entries option

            expect(component.dropdownValues.length).withContext('unexpected number of options').toBe(expectedNumberOfOptions);
        });

        it('should add options to selectedPeriod limited to amountOfDisplayedSingleMonths', () => {
            createComponent();
            component.amountOfDisplayedSingleMonths = 6;
            fixture.detectChanges();
            const expectedNumberOfOptions = component.amountOfDisplayedSingleMonths + 1; //+ 1 for older entries option

            expect(component.dropdownValues.length).withContext('unexpected number of options').toBe(expectedNumberOfOptions);
        });

        it('should add default item to dropdown when currentyear is inferior to configuration.cutoffyear', () => {
            createComponent();
            component.cutOffYear = new Date().getFullYear() + 1;
            fixture.detectChanges();

            expect(component.dropdownValues.at(-1)?.selectText).withContext('missing option').toBe(component.content.messages.OlderEntries);
        });

        it('should add additional dropdown item when present', () => {
            createComponent();
            component.additionalDropdownItem = additionalDropdownItem;
            fixture.detectChanges();

            expect(component.dropdownValues.at(-1)?.selectText).withContext('missing option').toBe(additionalDropdownItem.text);
        });

        it('should load items from api', () => {
            createComponent();
            component.pageSize = 1;
            component.endpoint = 'cashback';
            spyOn(component.itemsObjChange, 'emit');
            fixture.detectChanges();

            apiMock.get.next(apiSuccessResponse);

            expect(apiMock.get).toHaveBeenCalledTimes(1);
            expect(apiMock.get).toHaveBeenCalledWith(
                'cashback',
                {
                    pageIndex: 0,
                    pageSize: 1,
                    year: today.getFullYear(),
                    month: today.getMonth() + 1,
                },
                { showSpinner: true },
            );
            expect(component.itemsObj.items[0].claimedAmount).toBe(100);
            expect(component.itemsObjChange.emit).toHaveBeenCalledWith(component.itemsObj);

            expect(component.loadingData).withContext('unexpected value for loadingData').toBeFalse();
        });

        it('should reset component when loading from api fails', () => {
            createComponent();
            fixture.detectChanges();

            apiMock.get.error();

            expect(component.loadingData).withContext('unexpected value for loadingData').toBeFalse();
            expect(component.itemsObj.items.length).toBe(0);
        });

        it('should attach scroll event', waitForAsync(() => {
            createComponent();
            fixture.detectChanges();

            expect(scrollEvent).withContext('scroll event listener has not been added').toBeDefined();
        }));

        describe('should set items to an empty array', () => {
            beforeEach(() => {
                createComponent();
                component.endpoint = 'cashback';
                fixture.detectChanges();
            });

            it('when the response is null', () => {
                apiMock.get.next(null);

                expect(component.itemsObj.items).toBeEmptyArray();
            });

            it('when the response is an empty object', () => {
                apiMock.get.next({});

                expect(component.itemsObj.items).toBeEmptyArray();
            });

            it('when the response data object ("cashback") is null', () => {
                apiMock.get.next({ cashback: null });

                expect(component.itemsObj.items).toBeEmptyArray();
            });

            it('when the response data object ("cashback") is an empty object', () => {
                apiMock.get.next({ cashback: {} });

                expect(component.itemsObj.items).toBeUndefined();
            });

            it('when the the response data object ("cashback") is an empty array', () => {
                apiMock.get.next({ cashback: [] });

                expect(component.itemsObj.items).toBeUndefined();
            });
        });
    });

    describe('getItems()', () => {
        beforeEach(() => {
            createComponent();
            component.additionalDropdownItem = additionalDropdownItem; //will be added on init
            fixture.detectChanges();
        });

        it('should reset current date period id when called with resetCurrentMonth=true', () => {
            const current = component.dropdownValues[0];
            component.currentDatePeriodId = current!.id || 0;

            const selected = component.dropdownValues[1];
            component.selectedPeriod = selected;

            component.getItems(false, false);

            expect(component.currentDatePeriodId)
                .not.withContext('expected currentDatePeriodId not to be reset when called with false')
                .toBe(selected!.id!);

            component.getItems(false, true);

            expect(component.currentDatePeriodId).withContext('expected currentDatePeriodId to be reset when called with true').toBe(selected!.id!);
        });

        it('should clear message queue', () => {
            component.getItems(true, true);
            expect(messageQueueServiceMock.clear).toHaveBeenCalledWith({ clearPersistent: true });
        });

        it('should load items from api when selectedPeriod.type is 0', () => {
            // publish to finish call issued in ngOnInit()
            apiMock.get.next({ cashback: [] as any[], nextPage: -1 });

            const selected = component.dropdownValues[0];
            component.selectedPeriod = selected;

            expect(selected?.type).withContext('wrong option type selected').toBe(0);

            component.getItems(true, true);

            expect(apiMock.get).toHaveBeenCalledTimes(2); //once in ngOnInit(), once in getItems()
        });

        it('should hide month pagination when additional dropdown item selected', () => {
            component.displayMonthPagination = true;

            //select additional item
            component.selectedPeriod = component.dropdownValues.at(-1);
            component.getItems(true, true);

            expect(component.displayMonthPagination).withContext('unexpected displayMonthPagination value').toBeFalse();
        });

        it('should trigger "show" callback when additional dropdown item selected', () => {
            //select additional item
            component.selectedPeriod = component.dropdownValues.at(-1);
            component.getItems(true, true);

            expect(additionalDropdownItem.callbackHide).toHaveBeenCalledTimes(0);
            expect(additionalDropdownItem.callbackShow).toHaveBeenCalledTimes(1);
        });

        it('should trigger "hide" callback when additional dropdown item not selected', () => {
            //select anything but additional item
            component.selectedPeriod = component.dropdownValues[0];
            component.getItems(true, true);

            expect(additionalDropdownItem.callbackHide).toHaveBeenCalledTimes(1);
            expect(additionalDropdownItem.callbackShow).toHaveBeenCalledTimes(0);
        });
    });

    describe('navigateMonths()', () => {
        beforeEach(() => {
            createComponent();
            component.itemsObj = { items: [] };
            component.pageSize = 15;
            component.endpoint = 'cashback';
            component.loadingData = true;
            fixture.detectChanges();
            component.loadingData = false;
        });

        it('should set disableNext after data have been fetched', () => {
            component.currentDatePeriodId = 1;
            component.navigateMonths(true, false); // navigate forward
            apiMock.get.next(apiSuccessResponse);

            expect(component.disableNext).withContext('expected next to be disabled').toBeTrue();
        });

        it('should set disablePrevious after data have been fetched', () => {
            component.currentDatePeriodId = component.datesCollection.length - 2;
            component.navigateMonths(false, false); // navigate back
            apiMock.get.next(apiSuccessResponse);

            expect(component.disablePrevious).withContext('expected previous to be disabled').toBeTrue();
        });

        it('should navigate backward', () => {
            component.currentDatePeriodId = 1;
            component.navigateMonths(false, false);
            apiMock.get.next(apiSuccessResponse);
            fixture.detectChanges();

            const expected = component.datesCollection[2];

            expect(apiMock.get).toHaveBeenCalledWith(
                'cashback',
                {
                    pageIndex: 0,
                    pageSize: component.pageSize,
                    year: expected.year,
                    month: expected.month + 1,
                },
                { showSpinner: true },
            );
        });

        it('should navigate forward', () => {
            component.currentDatePeriodId = 1;
            component.navigateMonths(true, false);
            apiMock.get.next(apiSuccessResponse);

            const expected = component.datesCollection[0];

            expect(apiMock.get).toHaveBeenCalledWith(
                'cashback',
                {
                    pageIndex: 0,
                    pageSize: component.pageSize,
                    year: expected.year,
                    month: expected.month + 1,
                },
                { showSpinner: true },
            );
        });
    });

    describe('displayGotoDesktopMessage', () => {
        beforeEach(() => {
            createComponent();
            component.itemsObj = { items: [] };
            component.cutOffYear = 2014;
            component.cutOffMonth = 3;
            component.pageSize = 15;
            component.dateCollectionLastYear = 1999;
            component.endpoint = 'cashback';
            component.amountOfDisplayedSingleMonths = 6;
            component.loadingData = true; //do not call api in init
            fixture.detectChanges();

            component.loadingData = false;
        });

        it('should set displayGotoDestopMessage to false when selected date bigger cutOffDate', () => {
            assertDisplayGotoDestopMessage(4, 2014, false);
        });

        it('should set displayGotoDestopMessage to true when selected date same as cutOffDate', () => {
            assertDisplayGotoDestopMessage(3, 2014, true);
        });

        it('should not execute compareDatesForMessageDisplay fully when date or year is not set in the config', () => {
            component.cutOffMonth = component.cutOffYear = undefined;
            assertDisplayGotoDestopMessage(today.getMonth(), today.getFullYear(), false);
        });

        function assertDisplayGotoDestopMessage(selectedMonth: number, selectedYear: number, desktopmessageDisplayed: boolean) {
            component.selectedPeriod = component.datesCollection.filter((date: any) => date.year === selectedYear && date.month === selectedMonth)[0];

            component.currentDatePeriodId = component.selectedPeriod?.id || 0;

            component.getItems(false, true);
            apiMock.get.next(apiSuccessResponse);

            expect(apiMock.get).toHaveBeenCalledWith(
                'cashback',
                {
                    pageIndex: 0,
                    pageSize: component.pageSize,
                    year: selectedYear,
                    month: selectedMonth + 1,
                },
                { showSpinner: true },
            );
            expect(component.displayGotoDesktopMessage).withContext('unexpected displayGotoDestopMessage').toBe(desktopmessageDisplayed);
        }
    });

    describe('onscroll()', () => {
        let getItemsSpy: jasmine.Spy;

        beforeEach(() => {
            createComponent();
            getItemsSpy = spyOn(component, 'getItems');

            fixture.detectChanges();
            apiMock.get.next(apiSuccessResponse);

            windowMock.document.documentElement.scrollHeight = 2000;
            windowMock.document.body.scrollHeight = 1000;
            windowMock.innerHeight = 500;
            windowMock.scrollY = 1000;
        });

        it('should call getItems', fakeAsync(() => {
            scrollEvent.fire();
            tick(300);

            expect(getItemsSpy).toHaveBeenCalledTimes(1);
        }));

        it('should not call getItems when summary is selected', fakeAsync(() => {
            component.selectedPeriod = <DropdownValue>{ type: 1 };
            scrollEvent.fire();
            tick(300);

            expect(getItemsSpy).not.toHaveBeenCalled();
        }));

        it('should not call getItems when already loading', fakeAsync(() => {
            component.loadingData = true;
            scrollEvent.fire();
            tick(300);

            expect(getItemsSpy).not.toHaveBeenCalled();
        }));
    });
});
