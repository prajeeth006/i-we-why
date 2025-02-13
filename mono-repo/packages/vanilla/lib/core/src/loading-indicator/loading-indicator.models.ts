/**
 * Options for {@link LoadingIndicatorService.start}
 *
 * @stable
 */
export interface LoadingIndicatorOptions {
    /**
     * Number of milliseconds to wait before showing the loading indicator
     */
    delay?: number;
    blockScrolling?: boolean;
    url?: string;
    disabled?: boolean;
}
