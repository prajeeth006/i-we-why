import { Injectable, OnDestroy } from '@angular/core';

import {
    CookieName,
    CookieService,
    LaunchDarklyContextProviderService,
    Logger,
    TrackingService,
    UserEvent,
    UserLoginEvent,
    UserLogoutEvent,
    UserService,
} from '@frontend/vanilla/core';
import { LDClient, LDEvaluationDetail, LDFlagChangeset, LDFlagSet, LDOptions, initialize } from 'launchdarkly-js-client-sdk';
import { BehaviorSubject, Observable, ReplaySubject, Subscription, catchError, map, merge, of, switchMap, timeout } from 'rxjs';
import { first } from 'rxjs/operators';

import { LaunchDarklyConfig } from './launch-darkly.client-config';

/**
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class LaunchDarklyService implements OnDestroy {
    /**
     * LaunchDarkly SDK client object.
     *
     * Can be used directly to access all properties and methods provided by the SDK.
     *
     * For more information, see the [SDK Reference Guide](https://docs.launchdarkly.com/sdk/client-side/javascript).
     */
    client: LDClient;
    defaultOptions: LDOptions = {
        inspectors: [
            {
                type: 'flag-used',
                name: 'flag-used-inspector',
                method: (flagKey: string, flagDetail: LDEvaluationDetail) => this.trackFlagUsed(flagKey, flagDetail),
            },
        ],
    };
    private flags: LDFlagSet = {};
    private userAuthenticationSubscriber: Subscription;
    private _featureFlags = new BehaviorSubject<LDFlagSet>({});

    constructor(
        private userService: UserService,
        private contextProviderService: LaunchDarklyContextProviderService,
        private config: LaunchDarklyConfig,
        private trackingService: TrackingService,
        private cookieService: CookieService,
        private logger: Logger,
    ) {}

    private _clientInitialized = new ReplaySubject<void>(1);
    private get clientInitialized(): Observable<void> {
        return this._clientInitialized.pipe(first());
    }

    async initialize(clientId: string) {
        if (!this.client) {
            const options = Object.assign({}, this.defaultOptions, this.config.options);
            const context = await this.contextProviderService.getContext();
            this.client = initialize(clientId, context, options);

            this.client
                .waitForInitialization()
                .then(() => {
                    this.fetchLDFlags();
                    this._clientInitialized.next();
                    this.contextProviderService.contextChanged.subscribe(() => {
                        this.updateContext();
                    });
                    this.subscribeToUserAuthenticationEvents();
                })
                .catch((error: unknown) => {
                    this.logger.error('[LaunchDarkly] - Error while initializing SDK.', error);
                });

            this.client.on('change', async (changedFlags: LDFlagChangeset) => {
                await this.updateFlag(changedFlags);
                this.logger.info('[LaunchDarkly] - Flags changed', changedFlags);
            });

            this.client.on('error', (error: any) => {
                this.logger.error('[LaunchDarkly] - General error.', error);
            });
        }
    }

    /**
     * Emits the current value for the specified Feature flag.
     *
     *     // Usage (component example):
     *     export class HeaderComponent implements OnInit
     *     {
     *          buttonsEnabled = false;
     *          ngOnInit() {
     *              this.flagsService.getFeatureFlagValue('HeaderButtonsEnabled').subscribe((value) => {
     *                  this.buttonsEnabled = value;
     *              });
     *          }
     *     }
     *
     *     // Usage (Markup)
     *     <button *ngIf="buttonsEnabled" />
     *
     * @param featureFlagKey Case sensitive feature flag name.
     * @param defaultValue Default value to be used in case flag not available in LaunchDarkly or client not initialized after 5s.
     */
    getFeatureFlagValue(featureFlagKey: string, defaultValue?: any): Observable<any> {
        return this.clientInitialized.pipe(
            timeout({ first: 5000 }),
            switchMap(() => {
                this.flags[featureFlagKey] = this.client?.variation(featureFlagKey, defaultValue);
                this._featureFlags.next(this.flags);
                return this._featureFlags.pipe(map((flags: LDFlagSet) => flags[featureFlagKey]));
            }),
            catchError(() => {
                return of(defaultValue);
            }),
        );
    }

    /**
     * Activating experiment and tracking in Launch Darkly. Use either 1. "getFeatureFlagValue" method for getting flag and activating experiment or 2. "getFlagOnly" for getting flag and "activateExperiment" for activating experiment
     *
     *     // Usage (component example):
     *     export class HeaderComponent implements OnInit
     *     {
     *          buttonsEnabled = false;
     *          ngOnInit() {
     *              this.flagsService.activateExperiment('HeaderButtonsEnabled').subscribe((value) => {
     *                  this.buttonsEnabled = value;
     *              });
     *          }
     *     }
     *
     *     // Usage (Markup)
     *     <button *ngIf="buttonsEnabled" />
     *
     * @param featureFlagKey Case sensitive feature flag name.
     * @param defaultValue Default value to be used in case flag not available in LaunchDarkly or client not initialized after 5s.
     */
    activateExperiment(featureFlagKey: string, defaultValue?: any): Observable<LDEvaluationDetail> {
        return this.clientInitialized.pipe(
            timeout({ first: 5000 }),
            map(() => this.client?.variationDetail(featureFlagKey, defaultValue)),
        );
    }

    /**
     * Returns the current value for the specified Feature flag, without activating experiment in LaunchDarkly and without tracking the occurance
     *
     *     // Usage (component example):
     *     export class HeaderComponent implements OnInit
     *     {
     *          buttonsEnabled = false;
     *          ngOnInit() {
     *              this.flagsService.getFlagOnly('HeaderButtonsEnabled').subscribe((value) => {
     *                  this.buttonsEnabled = value;
     *              });
     *          }
     *     }
     *
     *     // Usage (Markup)
     *     <button *ngIf="buttonsEnabled" />
     *
     * @param featureFlagKey Case sensitive feature flag name.
     * @param defaultValue Default value to be used in case flag not available in LaunchDarkly or client not initialized after 5s.
     */
    getFlagOnly(featureFlagKey: string, defaultValue?: any): Observable<any> {
        return this.clientInitialized.pipe(
            timeout({ first: 5000 }),
            switchMap(() => {
                return this._featureFlags.pipe(map((flags: LDFlagSet) => flags[featureFlagKey]));
            }),
            catchError(() => {
                return of(defaultValue);
            }),
        );
    }

    /**
     * Reloads the flags for a new context .
     * Only call this method when any of the values of the provided context has changed.
     */
    updateContext() {
        this.client?.identify(this.contextProviderService.context).then((flags: LDFlagSet) => {
            Object.keys(flags).forEach((flag: string) => {
                this.flags[flag] = flags[flag];
            });
        });
    }

    async ngOnDestroy() {
        this.userAuthenticationSubscriber?.unsubscribe();
        await this.client?.close();
    }

    private fetchLDFlags() {
        this.flags = this.client?.allFlags();
        this._featureFlags.next(this.flags);
    }

    private subscribeToUserAuthenticationEvents() {
        this.userAuthenticationSubscriber = merge(
            this.userService.events.pipe(first((e: UserEvent) => e instanceof UserLoginEvent)),
            this.userService.events.pipe(first((e: UserEvent) => e instanceof UserLogoutEvent)),
        ).subscribe(async () => {
            await this.contextProviderService.reloadContext();
            this.updateContext();
        });
    }

    private async updateFlag(changedFlags: LDFlagChangeset) {
        Object.keys(changedFlags).forEach((flag: string) => {
            this.flags[flag] = changedFlags[flag]?.current;
        });
        this._featureFlags.next(this.flags);
    }

    private trackFlagUsed(flagKey: string, flagDetail: LDEvaluationDetail) {
        if (flagDetail.reason?.inExperiment) {
            // tracking only when it's part of an experiment as suggested by LD team.
            this.trackingService.triggerEvent('ld_experiment_evaluation', {
                'component.CategoryEvent': 'ld_experiment_evaluation',
                'component.ActionEvent': 'load experiment',
                'component.LabelEvent': flagDetail.value,
                'component.EventDetails': flagKey,
                'component.URLClicked': location.href,
                'component.PositionEvent': flagDetail.variationIndex,
            });

            // Writes cookie for WA team tracking.
            let ldExp = this.cookieService.get(CookieName.LdExperiment);
            const ldExpValue = `${flagKey}_${flagDetail.variationIndex}`;

            if (!ldExp) {
                this.cookieService.putRaw(CookieName.LdExperiment, ldExpValue);
            } else {
                if (!ldExp.includes(ldExpValue)) {
                    ldExp += `|${ldExpValue}`;
                    this.cookieService.putRaw(CookieName.LdExperiment, ldExp);
                }
            }
        }
    }
}
