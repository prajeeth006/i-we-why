/**
 * Base class for user events.
 *
 * @stable
 */
export abstract class UserEvent {}

/**
 * @whatItDoes Represents an event triggered when User properties update.
 *
 * @stable
 */
export class UserUpdateEvent extends UserEvent {
    constructor(public diff: Map<string, any>) {
        super();
    }
}

/**
 * @whatItDoes Represents an event triggered after User logs in.
 *
 * @stable
 */
export class UserLoginEvent extends UserEvent {}

/**
 * @whatItDoes Represents an event triggered before User logs in.
 *
 * @stable
 */
export class UserLoggingInEvent extends UserEvent {}

/**
 * @whatItDoes Represents an event triggered after User login but before post login hooks are executed. It is triggered before {@link UserLoginEvent}.
 *
 * @stable
 */
export class UserPreHooksLoginEvent extends UserEvent {}

/**
 * @whatItDoes Represents an event triggered after User logs out.
 *
 * @stable
 */
export class UserLogoutEvent extends UserEvent {
    constructor(public isManualLogout?: boolean) {
        super();
    }
}

/**
 * @whatItDoes Represents an event triggered before User logs out.
 *
 * @stable
 */
export class UserLoggingOutEvent extends UserEvent {}

/**
 * @whatItDoes Represents an event triggered after User is automatically logged out due to time limit.
 *
 * @stable
 */
export class UserAutologoutEvent extends UserEvent {}

/**
 * @whatItDoes Represents an event triggered after User is automatically logged out due to 24 hours limit rtms event.
 *
 * @stable
 */
export class UserAutologout24HoursEvent extends UserEvent {}

/**
 * @whatItDoes Represents an event triggered when User login fails.
 *
 * @stable
 */
export class UserLoginFailedEvent extends UserEvent {}

/**
 * @whatItDoes Represents an event triggered when User session expires (401 on any request).
 *
 * @stable
 */
export class UserSessionExpiredEvent extends UserEvent {}
