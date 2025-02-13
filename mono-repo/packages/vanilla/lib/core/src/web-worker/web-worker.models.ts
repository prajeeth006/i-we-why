/**
 * @stable
 */
export enum WorkerType {
    AccountMenuTasksTimeout = 'account-menu-tasks-timeout',
    AutoLogoutTimeout = 'auto-logout-timeout',
    ClockInterval = 'clock-interval',
    ConfettiTimeout = 'confetti-timeout',
    ConnectCardCheckInterval = 'connect-card-check-interval',
    ConnectCardLoginOptionInterval = 'connect-card-login-option-interval',
    CookieDslValuesProviderInterval = 'cookie-dsl-values-provider-interval',
    CounterDslValuesProviderInterval = 'counter-dsl-values-provider-interval',
    DataLayerTrackingInterval = 'data-layer-tracking-interval',
    DateTimeDslValuesProviderInterval = 'date-time-dsl-values-provider-interval',
    DebounceButtonsTimeout = 'debounce-buttons-timeout',
    HintQueueTimeout = 'hint-queue-timeout',
    HintTimerTimeout = 'hint-timer-timeout',
    InactiveLogoutTimeout = 'inactive-logout-timeout',
    InactivityScreenInterval = 'inactivity-screen-interval',
    InactivityScreenTimeout = 'inactivity-screen-timeout',
    InboxCountPollInterval = 'inbox-count-poll-interval',
    LivePersonInterval = 'live-person-interval',
    LoginDurationInterval = 'login-duration-interval',
    LoginPasswordInterval = 'login-password-interval',
    LoginUsernameInterval = 'login-username-interval',
    LossLimitsInterval = 'loss-limits-interval',
    MessagePanelTimeout = 'message-panel-timeout',
    NativeAutoPingInterval = 'native-auto-ping-interval',
    OffersInterval = 'offers-interval',
    OffersTimeout = 'offers-timeout',
    OfflinePagePollInterval = 'offline-page-poll-interval',
    PinCheckInterval = 'pin-check-interval',
    PinLoginOptionInterval = 'pin-login-option-interval',
    PlayBreakTimerInterval = 'play-break-timer-interval',
    PlayerActiveWagerPopupTimerInterval = 'player-active-wager-popup-timer-interval',
    PlayerActiveWagerTimerInterval = 'player-active-wager-timer-interval',
    ReferFriendOverlayTimeout = 'refer-friend-overlay-timeout',
    RouteScrollingTimeout = 'route-scrolling-timeout',
    RtmsLayerTimeout = 'rtms-layer-timeout',
    SelfExclusionPollInterval = 'self-exclusion-poll-interval',
    SessionLifetimeCheckTimeout = 'session-lifetime-check-timeout',
    SessionLimitsInterval = 'session-limits-interval',
    TerminalSessionTimeout = 'terminal-session-timeout',
}

/**
 * @stable
 */
export interface WebWorker {
    worker: Worker;
    startTime: number;
}

export interface WebWorkerOptions {
    interval?: number;
    timeout?: number;
    runInsideAngularZone?: boolean;
}
