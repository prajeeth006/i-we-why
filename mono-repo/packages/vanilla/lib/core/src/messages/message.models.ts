/**
 * @stable
 */
export enum MessageType {
    Default = 'Default',
    Information = 'Information',
    Warning = 'Warning',
    Error = 'Error',
    Success = 'Success',
    Announcement = 'Announcement',
}

/**
 * @stable
 */
export enum MessageLifetime {
    Single = 'Single',
    TempData = 'TempData',
}

/**
 * Scope for {@link Message}.
 *
 * @stable
 */
export enum MessageScope {
    AutoLogin = 'autologin',
    BackToApp = 'backtoapp',
    GamingDeclaration = 'gaming-declaration',
    Inbox = 'INBOX',
    Login = 'login',
    LoginMessages = 'login-messages',
    SessionInfo = 'sessioninfo',
}

/**
 * @stable
 */
export interface Message {
    html: string;
    type: MessageType;
    lifetime: MessageLifetime;
    name?: string;
    scope?: string | undefined; // Optional undefined
}

/**
 * Options for {@link MessageQueueService#clear}
 *
 * @stable
 */
export interface MessageQueueClearOptions {
    /**
     *If true also clears TempData messages, instead of just touching them (changing TempData to Single). Default is `false`.
     */
    clearPersistent: boolean;
    /**
     *If true also clears messages stored in Session storage. Useful in cases component init might run before navigation promise resolves. Default is `false`.
     */
    clearStoredMessages?: boolean;
    scope?: string;
}
