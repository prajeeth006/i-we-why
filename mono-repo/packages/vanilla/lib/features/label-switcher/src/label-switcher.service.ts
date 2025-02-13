import { Injectable } from '@angular/core';

import {
    AuthService,
    CookieName,
    CookieService,
    DateTimeService,
    DslService,
    EventsService,
    GeolocationPosition,
    GeolocationService,
    Logger,
    MenuContentItem,
    NativeAppService,
    NativeEventType,
    NavigationService,
    PERMANENT_COOKIE_EXPIRATION,
    Page,
    SimpleEvent,
    ToastrQueueService,
    ToastrSchedule,
    ToastrType,
    UrlService,
    UserService,
    VanillaEventNames,
} from '@frontend/vanilla/core';
import { BehaviorSubject, Observable, Subject, catchError, distinctUntilChanged, filter, take, takeUntil, tap } from 'rxjs';

import { LabelSwitcherTrackingService } from './label-switcher-tracking.service';
import { LabelSwitcherConfig } from './label-switcher.client-config';
import { LabelSwitcherItem } from './label-switcher.models';

@Injectable({
    providedIn: 'root',
})
export class LabelSwitcherService {
    private currentPosition: GeolocationPosition | null;
    private currentLabelItemEvent = new BehaviorSubject<LabelSwitcherItem | undefined>(undefined);
    private unsubscribe = new Subject<void>();

    constructor(
        private config: LabelSwitcherConfig,
        private page: Page,
        private toastrQueueService: ToastrQueueService,
        private cookieService: CookieService,
        private geoLocationService: GeolocationService,
        private dslService: DslService,
        private logger: Logger,
        private trackingService: LabelSwitcherTrackingService,
        private user: UserService,
        private nativeAppService: NativeAppService,
        private authService: AuthService,
        private navigationService: NavigationService,
        private urlService: UrlService,
        private eventsService: EventsService,
        private dateTimeService: DateTimeService,
    ) {}

    /** Gets label switcher item event based on current label. */
    get currentLabelItemEvent$(): Observable<LabelSwitcherItem | undefined> {
        return this.currentLabelItemEvent;
    }

    /** Gets label switcher item based on user's geo location. */
    get currentGeoLocationItem(): LabelSwitcherItem | undefined {
        return this.items.find(
            (i: LabelSwitcherItem) => i.region?.toLowerCase() === this.currentPosition?.mappedLocation?.stateClient?.toLowerCase(),
        );
    }

    get messages(): { [attr: string]: string } {
        return this.config.resources.messages;
    }

    private _items: LabelSwitcherItem[] = [];

    /** Gets all label switcher items. */
    get items(): LabelSwitcherItem[] {
        return this._items;
    }

    private _currentLabelItem: LabelSwitcherItem | undefined;

    /** Gets label switcher item based on current label. */
    get currentLabelItem(): LabelSwitcherItem | undefined {
        return this._currentLabelItem;
    }

    init() {
        this.prepareItems();
        this.checkForContentErrors();
        this.geoLocationService.whenReady.subscribe(() =>
            this.geoLocationService.positionChanges
                .pipe(distinctUntilChanged((prev, curr) => prev.mappedLocation?.stateClient == curr.mappedLocation?.stateClient))
                .subscribe((position: GeolocationPosition) => {
                    this.unsubscribe.next();
                    this.currentPosition = position;
                    this.showToasters();
                }),
        );

        if (this.config.persistStayInState) {
            this.eventsService.newEvents
                .pipe(
                    filter(
                        (event: SimpleEvent) =>
                            event.eventName === VanillaEventNames.ToastrClosed && event.data?.toastrContent?.name?.toLowerCase() === 'changelabel',
                    ),
                )
                .subscribe(() => {
                    const state = this.currentPosition?.mappedLocation?.stateClient;
                    if (state)
                        this.cookieService.put(this.getCookieName(state), state, {
                            expires: this.setCookieExpiration(),
                        });
                });
        }
    }

    async switchLabel(item: LabelSwitcherItem) {
        this.trackingService.trackConfirmationOverlay('click', `${item.text}, ${this.currentLabelItem?.text}`, this.messages.Overlay_Ok_Epcot || '');
        await this.logout();
        this.cookieService.put(CookieName.StateChanged, '1');
        const url = this.urlService.parse(item.url);
        url.search.append('_showChangeLabelSuccess', 'true');

        if (this.nativeAppService.isNative) {
            this.nativeAppService.sendToNative({
                eventName: NativeEventType.LOCATION,
                parameters: {
                    label: item.name,
                    countryCode: item.country,
                    stateCode: item.regionCode,
                    state: item.region,
                    url: item.url,
                },
            });
        } else {
            this.navigationService.goTo(url);
        }
    }

    private async logout(): Promise<void> {
        return this.user.isAuthenticated ? this.authService.logout({ redirectAfterLogout: false }) : Promise.resolve();
    }

    private prepareItems() {
        this.config.main.children.forEach((item: MenuContentItem) => {
            this._items.push({
                name: item.name,
                text: item.text,
                region: item.parameters.region,
                regionCode: item.parameters.regionCode,
                country: item.parameters.country,
                url: item.url,
                isActive: this.page.domain.replace(/\./g, '').trim() == item.name.replace(/\./g, '').trim(),
                image: item.image,
            });
        });

        this._currentLabelItem = this.items.find((i: LabelSwitcherItem) => i.isActive);
        this.currentLabelItemEvent.next(this._currentLabelItem);
    }

    private checkForContentErrors() {
        if (!this.currentLabelItem) {
            this.logger.error('Current label is not present in label-switcher items!');
        }
    }

    private showToasters() {
        this.logger.infoRemote('LabelSwitcher: Location changed, initializing show toasters.');
        const state = this.currentPosition?.mappedLocation?.stateClient;
        this.dslService
            .evaluateExpression<boolean>(this.config.showChangeLabelToaster)
            .pipe(
                tap((show) => {
                    this.logger.infoRemote(`LabelSwitcher: showChangeLabelToaster evaluated to ${show}`);
                    if (this.cookieService.get(CookieName.ShowChangeLabelSuccess) && !show) {
                        this.toastrQueueService.add(ToastrType.ChangeLabelSuccess, {
                            schedule: ToastrSchedule.Immediate,
                            placeholders: { label: this.currentLabelItem?.text || '' },
                        });
                        this.cookieService.remove(CookieName.ShowChangeLabelSuccess);
                    }
                }),
                takeUntil(this.unsubscribe),
                filter(Boolean),
                take(1),
                catchError((error) => {
                    this.logger.errorRemote('LabelSwitcher: failed to evaluate showChangeLabelToaster expression.', error);
                    throw error;
                }),
            )
            .subscribe(() => {
                if (state && !this.stayInStateAlreadyChosen(state)) {
                    this.logger.infoRemote('LabelSwitcher: adding toaster to the queue');
                    this.toastrQueueService.add(ToastrType.ChangeLabel, {
                        schedule: ToastrSchedule.Immediate,
                        placeholders: {
                            state: this.currentGeoLocationItem?.text || '',
                            originstate: this.currentLabelItem?.text || '',
                        },
                    });
                } else {
                    this.logger.infoRemote('LabelSwitcher: toaster will not be added to the queue due to condition not met.');
                }
            });

        this.dslService
            .evaluateExpression<boolean>(this.config.isRestrictedAccessCondition)
            .pipe(takeUntil(this.unsubscribe), filter(Boolean), take(1))
            .subscribe(() => {
                if (!this.isToastAlreadyShownInState(ToastrType.RestrictedAccess, state)) {
                    this.toastrQueueService.add(ToastrType.RestrictedAccess, {
                        schedule: ToastrSchedule.Immediate,
                        placeholders: {
                            label: this.currentLabelItem?.name || '',
                            state: this.currentGeoLocationItem?.text || '',
                        },
                    });
                    this.addStateToToast(ToastrType.RestrictedAccess, state);
                }
            });
    }

    private stayInStateAlreadyChosen(state: string): boolean {
        const stateName = this.cookieService.get(this.getCookieName(state));

        this.logger.infoRemote(`LabelSwitcher: stay in state already chosen for ${state}: ${!!stateName}`);
        return !!stateName;
    }

    private setCookieExpiration(): Date {
        const expireDate = this.dateTimeService.now();
        expireDate.setHours(23, 59, 59, 999);

        return expireDate;
    }

    private getCookieName(state: string): string {
        const stateNameWithoutSpace = state.replace(/\s/g, '');
        return `vn_ls_${stateNameWithoutSpace}`;
    }

    private addStateToToast(toastKey: string, state: string | undefined | null) {
        if (state && !this.isToastAlreadyShownInState(toastKey, state)) {
            this.cookieService.addToQueryCollection(CookieName.ToastShownInStates, toastKey, state, { expires: PERMANENT_COOKIE_EXPIRATION });
        }
    }

    private isToastAlreadyShownInState(toastKey: string, state: string | undefined | null): boolean {
        if (!state) return false;

        const states = this.cookieService.getQueryCollection(CookieName.ToastShownInStates, toastKey);
        this.logger.infoRemote(`LabelSwitcher: toaster already shown in ${state}: ${states?.includes(state)}`);
        return states?.includes(state);
    }
}
