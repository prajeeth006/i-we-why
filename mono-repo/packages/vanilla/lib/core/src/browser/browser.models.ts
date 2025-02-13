/**
 * @stable
 */
export enum SameSiteMode {
    None = 'None',
    Lax = 'Lax',
    Strict = 'Strict',
    Unspecified = 'Unspecified',
}

/**
 * Known vanilla elements gettable by {@link ElementRepositoryService}.
 *
 * @stable
 */
export enum VanillaElements {
    ACCOUNT_MENU_HEADER_ANCHOR = 'ACCOUNT_MENU_HEADER_ANCHOR',
    ACCOUNT_MENU_TASKS_ANCHOR = 'ACCOUNT_MENU_TASKS_ANCHOR',
    AUTH_HEADER_SECTION = 'AUTH_HEADER_SECTION',
    AVATAR_HEADER_ANCHOR = 'AVATAR_HEADER_ANCHOR',
    BALANCE_HEADER_ANCHOR = 'BALANCE_HEADER_ANCHOR',
    DEPOSIT_BUTTON_ANCHOR = 'DEPOSIT_BUTTON_ANCHOR',
    HEADER_SLOT = 'HEADER_SLOT',
    MAIN_SLOT = 'MAIN_SLOT',
    NAV_LAYOUT_CONTAINER = 'NAV_LAYOUT_CONTAINER',
    QUICK_DEPOSIT_WRAPPER = 'QUICKDEPOSIT_WRAPPER',
    TERMINAL_BALANCE_HEADER_ANCHOR = 'TERMINAL_BALANCE_HEADER_ANCHOR',
}

/**
 * @stable
 */
export enum NetworkStatusSource {
    WindowEvent = 'windowEvent',
    ApiRequest = 'apiRequest',
    Initial = 'initial',
}

/**
 * @stable
 */
export enum AnimationControl {
    Disable = 'Disable',
}

/**
 * Represents browser local store keys.
 *
 * @stable
 */
export enum LocalStoreKey {
    AuthStorageKey = 'vn-authState',
    ClockShowTimes = 'clockShowTimes',
    LugasTimestamp = 'lugasTimestamp',
    PlayBreakType = 'playBreakType',
    SeonSessionKey = 'seon_session_key',
    Tracking = 'tracking',
    VnProductMenuReturnUrl = 'vn.ProductMenuReturnUrl',
    WrapperEmulatorSettings = 'wrapper_emulator.settings',
    ErrorLogTime = 'error-log-time',
}

/**
 * Represents browser session store keys.
 *
 * @stable
 */
export enum SessionStoreKey {
    MessageQueue = 'message-queue',
    RouteScrollInfo = 'route-scroll-info',
    IsBalanceVisible = 'isBalanceVisible',
    ClientLoginDuration = 'clientLoginDuration',
}

/**
 * @stable
 */
export interface LoadingProfile {
    waterfall: LoadingWaterfall;
    network: PerformanceResourceTiming[];
    events: EventTimestamps;
}

/**
 * @stable
 */
export interface PerformanceProfile {
    waterfall: LoadingWaterfall;
    network: PerformanceResourceTiming[];
    events: EventTimestamps;
}

/**
 * @stable
 */
export interface LoadingWaterfall {
    assetsFetch: number;
    appCompilation: number;
    appRun: number;
}

/**
 * @stable
 */
export interface EventTimestamps {
    domContentLoadedEvent: number;
    loadEvent: number;
}

/**
 * @stable
 */
export interface NetworkStatusEvent {
    source: NetworkStatusSource;
    online: boolean;
}

export interface StorageBackend {
    set(key: string, value: string): void;

    get(key: string): string | null;

    delete(key: string): void;

    keys(): string[];
}

/**
 * @stable
 */
export type ElementPredicate = (element: HTMLElement) => AnimationControl | undefined;
