/**
 * Represents a client-side tag manager script configured in {@link TrackingConfig}.
 *
 * @stable
 */
export interface ClientTagManager {
    name: string;
    script: string;
}

/**
 * @stable
 */
export interface TrackingServiceOptions {
    timeout: number;
}

/**
 * @stable
 */
export interface EventNames {
    pageView: string;
    userLogout: string;
}

/**
 * @internal
 */
export const eventNames: EventNames = {
    pageView: 'pageView',
    userLogout: 'Event.Logout',
};

/**
 * @internal
 */
export interface CommunicationType {
    id: string;
    name: string;
    selected: boolean;
}

/**
 * @internal
 */
export interface CommunicationSettings {
    settings: CommunicationType[];
}

/**
 * @internal
 */
export interface ContentItemTracking {
    event: string;
    data: { [key: string]: string };
}
