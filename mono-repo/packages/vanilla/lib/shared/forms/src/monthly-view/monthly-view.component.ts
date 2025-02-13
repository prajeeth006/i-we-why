import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ApiBase, IntlService, MessageQueueService, WINDOW, WindowEvent, trackByProp } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { debounce } from 'lodash-es';

import { DropdownValue } from '../models/dropdown-value.model';

/**
 * @whatItDoes Provides functionality of displaying dropdown with month names and years, restrict months and years,
 * previous and next buttons and displaying data from provided api object and endpoint name. Will be removed in version 4.
 *
 * @howToUse `<lh-monthly-view [cutOffYear]="cutOffYear"
 *                             [cutOffMonth]="cutOffMonth"
 *                             [pageSize]="pageSize"
 *                             [dateCollectionLastYear]="dateCollectionLastYear"
 *                             [amountOfDisplayedSingleMonths]="amountOfDisplayedSingleMonths"
 *                             [api]="api" endpoint="transactions"
 *                             [content]="content"
 *                             [additionalDropdownItem]="summaryItem"
 *                             [(itemsObj)]="transactions">`
 *
 * @stable
 */
@Component({
    standalone: true,
    imports: [CommonModule, FormsModule, IconCustomComponent],
    selector: 'lh-monthly-view',
    templateUrl: 'monthly-view.component.html',
})
export class MonthlyViewComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() cutOffYear: any;
    @Input() cutOffMonth: any;
    @Input() pageSize: number;
    @Input() dateCollectionLastYear: any;
    @Input() amountOfDisplayedSingleMonths: number;
    @Input() api: ApiBase;
    @Input() endpoint: string;
    @Input() content: any;
    @Input() additionalDropdownItem: any;
    @Input() itemsObj: any;
    @Output() itemsObjChange = new EventEmitter<any>();

    readonly trackById = trackByProp<DropdownValue>('id');
    dropdownValues: DropdownValue[] = [];
    datesCollection: any[] = [];
    selectedPeriod: DropdownValue | undefined;
    displayMonthPagination: boolean;
    currentDatePeriodId = 0;
    loadingData: boolean;
    displayGotoDesktopMessage: boolean;
    hideNoItemsFoundMessage: boolean;
    disableNext: boolean;
    disablePrevious: boolean;
    noItemsFound: string;

    private months: string[];
    private nextPage = 0;
    private noItemsFoundTemplate: string;
    private delta = 1200; // Scroll delta. Increase to load earlier
    private currentDate = new Date();
    private currentMonth: number = this.currentDate.getMonth();
    private currentYear: number = this.currentDate.getFullYear();

    private elementRef = inject(ElementRef);
    private messageQueue = inject(MessageQueueService);
    private intlService = inject(IntlService);
    readonly #window = inject(WINDOW);

    ngOnInit() {
        if (!this.itemsObj) {
            this.itemsObj = {};
        }

        this.months = this.intlService.getMonths().map((m) => {
            return m.shortName;
        });

        this.createDatesCollection();

        if (!this.content.messages.NoEntriesFound) {
            this.content.messages.NoEntriesFound = '';
        }

        // can handle sitecore strings with and without placeholder for current month and year
        this.noItemsFoundTemplate =
            this.content.messages.NoEntriesFound.indexOf('{0}') === -1
                ? this.content.messages.NoEntriesFound + ' {0}'
                : this.content.messages.NoEntriesFound;

        this.createDropdownContent();

        this.selectedPeriod = this.dropdownValues[0];
        this.currentDatePeriodId = this.dropdownValues[0]?.id || 0;

        if (this.selectedPeriod?.year && this.selectedPeriod?.month !== null) {
            this.fetchItemsData(true, this.nextPage, this.pageSize, +this.selectedPeriod.year, +this.selectedPeriod.month);
        }
    }

    ngAfterViewInit() {
        this.#window.addEventListener(
            WindowEvent.Scroll,
            debounce(() => this.onScroll(), 250),
            false,
        );
    }

    ngOnDestroy() {
        this.#window.removeEventListener(
            WindowEvent.Scroll,
            debounce(() => this.onScroll(), 250),
            false,
        );
    }

    getItems(resetPage: boolean, resetCurrentMonth: boolean) {
        if (resetPage) {
            this.nextPage = 0;
        }

        //reset current month for paging months
        if (resetCurrentMonth) {
            this.currentDatePeriodId = this.selectedPeriod?.id || 0;
        }

        // stop condition, infinitive scroll (no more data)
        if (this.nextPage === -1) {
            return;
        }

        // clear previous messages
        this.messageQueue.clear({ clearPersistent: true });

        if (this.selectedPeriod?.type === 0) {
            this.fetchItemsData(
                resetPage,
                this.nextPage,
                this.pageSize,
                this.datesCollection[this.currentDatePeriodId].year,
                this.datesCollection[this.currentDatePeriodId].month,
            );
        }

        if (this.additionalDropdownItem) {
            if (this.additionalDropdownItem.type === this.selectedPeriod?.type) {
                this.displayMonthPagination = false;
                this.additionalDropdownItem.callbackShow(this);
            } else {
                this.additionalDropdownItem.callbackHide(this);
            }
        }
    }

    navigateMonths(goForward: boolean, disabled: boolean) {
        //no next or previous month
        if (disabled) {
            return;
        }

        if (goForward) {
            this.currentDatePeriodId--;
        } else {
            this.currentDatePeriodId++;
        }

        //sets the dropdown option to the same value as current month when reached trough next/previous navigation
        //for the configured options, but not for getsummary
        //as long as there are dropdown values to display (stop at OlderEntries)
        if (this.currentDatePeriodId <= this.amountOfDisplayedSingleMonths) {
            this.selectedPeriod = this.dropdownValues[this.currentDatePeriodId];
        }

        this.getItems(true, false);
    }

    private createDatesCollection() {
        let key = 0;
        //lastyear fallback 1996 (bet and win as founded 1997)
        const lastYear = Math.max(this.cutOffYear || 0, this.dateCollectionLastYear || 1996);

        while (
            this.currentYear > lastYear ||
            (this.currentYear === lastYear && (this.cutOffMonth === undefined || this.currentMonth >= this.cutOffMonth))
        ) {
            let nextMonth, previousMonth;

            if (this.currentMonth < 0) {
                this.currentMonth = 11;
                this.currentYear--;
            }

            nextMonth = this.months[this.currentMonth + 1];
            previousMonth = this.months[this.currentMonth - 1];

            if (this.currentMonth === 0) {
                previousMonth = this.months[11];
            }

            if (this.currentMonth === 11) {
                nextMonth = this.months[0];
            }

            this.datesCollection.push({
                id: key,
                type: 0,
                month: this.currentMonth,
                year: this.currentYear,
                date: new Date(this.currentYear, this.currentMonth, 1),
                selectText: this.months[this.currentMonth] + ' ' + this.currentYear,
                shortText: this.months[this.currentMonth] + ' ' + this.currentYear,
                nextMonth,
                previousMonth,
            });

            this.currentMonth--;
            key++;
        }
        if (this.datesCollection.length === 0) {
            // if currentYear is prior to last year, add default item
            this.datesCollection.push({
                id: 0,
                type: 0,
                selectText: this.content.messages['OlderEntries'],
            });
        }
    }

    private fetchItemsData(resetPage: boolean, pageIndex: number, pageSize: number, year: number, month: number) {
        // create no items found message with info about selected month and year
        this.createNoItemsMessage(year, month);

        if (this.loadingData) {
            // there is already a previous request
            return;
        }

        this.displayMonthPagination = false;
        //reset flag from compareDatesForMessageDisplay helper function to avoid different displaytimes in case of two messages
        this.displayGotoDesktopMessage = false;

        this.loadingData = true;
        const queryParams = {
            pageIndex: pageIndex,
            pageSize: pageSize,
            year: year,
            month: month !== undefined ? month + 1 : null,
        };
        this.api.get(this.endpoint, queryParams, { showSpinner: true }).subscribe({
            next: (data: any) => {
                if (!data?.[this.endpoint]) {
                    this.itemsObj.items = [];
                } else if (data[this.endpoint].length > 0) {
                    if (resetPage) {
                        this.itemsObj = data;
                        this.itemsObj.items = [];
                    }

                    this.itemsObj.items.push.apply(this.itemsObj.items, data[this.endpoint]);
                    this.nextPage = data.nextPage;
                    this.itemsObjChange.emit(this.itemsObj);

                    if (this.nextPage === -1 && this.selectedPeriod?.type === 0) {
                        this.displayMonthPaginationFn();
                    }
                } else {
                    if (data.nextPage === -1) {
                        this.itemsObj.items = [];
                    }

                    this.nextPage = -1;
                }

                //monthIndex-1 because it was previously increased for the request
                this.compareDatesForMessageDisplay(year, month);

                this.loadingData = false;
            },
            error: () => {
                this.itemsObj.items = [];
                this.loadingData = false;
            },
        });
    }

    private displayMonthPaginationFn() {
        this.disableNext = this.currentDatePeriodId === 0;
        this.disablePrevious = this.currentDatePeriodId >= this.datesCollection.length - 1;
        this.displayMonthPagination = true;
    }

    private compareDatesForMessageDisplay(year: number, month: number) {
        if (this.cutOffYear === undefined || this.cutOffMonth === undefined) {
            return;
        }

        const cutOffDate = new Date(this.cutOffYear, this.cutOffMonth, 1),
            requestDate = new Date(year, month, 1);
        this.displayGotoDesktopMessage = false;

        if (requestDate <= cutOffDate) {
            this.displayGotoDesktopMessage = true;
            this.hideNoItemsFoundMessage = true;

            //display hideNoItemsFoundMessage if its the same month as the cutOffMonth
            if (requestDate.getTime() === cutOffDate.getTime()) {
                this.hideNoItemsFoundMessage = false;
            }
        }
    }

    private createDropdownContent() {
        //slice the appropriate amount of items from the datesCollection array for display in the dropdown
        const amountOfMonths =
            this.amountOfDisplayedSingleMonths != null
                ? Math.min(this.amountOfDisplayedSingleMonths + 1, this.datesCollection.length)
                : this.datesCollection.length;
        this.dropdownValues = this.datesCollection.slice(0, amountOfMonths);
        this.dropdownValues = this.dropdownValues.map((value, index) =>
            index === amountOfMonths - 1
                ? {
                      ...value,
                      selectText: this.content.messages.OlderEntries,
                  }
                : value,
        );

        //transactions: add twelve month summary for enabled labels
        if (this.additionalDropdownItem) {
            this.dropdownValues.push({
                id: null,
                type: this.additionalDropdownItem.type,
                month: null,
                year: null,
                selectText: this.additionalDropdownItem.text,
                shortText: null,
            });
        }
    }

    private createNoItemsMessage(requestedYear: number, requestedMonth: number) {
        const periodString = requestedYear || requestedMonth ? `(${this.months[requestedMonth]} ${requestedYear})` : '';
        this.noItemsFound = this.noItemsFoundTemplate.replace('{0}', periodString);
    }

    /**
     * Handles the scroll event to load more items when the user scrolls near the bottom of the page.
     * Calculates the remaining scroll distance and triggers data fetching if necessary.
     */
    private onScroll() {
        const nativeWindow = this.#window;
        const element = this.elementRef.nativeElement.querySelector('.message-panel + *') || nativeWindow.document.body;

        const spaceOfElementAndPage = nativeWindow.document.documentElement.scrollHeight - element.scrollHeight;
        const scrollToBottom = element.scrollHeight - nativeWindow.innerHeight - nativeWindow.scrollY + spaceOfElementAndPage;

        if (!this.loadingData && this.selectedPeriod?.type === 0 && scrollToBottom < this.delta) {
            this.getItems(false, false);
        }
    }
}
