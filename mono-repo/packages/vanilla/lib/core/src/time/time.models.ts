/**
 * @stable
 */
export enum TimeUnit {
    Second = 'Second',
    Minute = 'Minute',
    Hour = 'Hour',
    Day = 'Day',
}

/**
 * @stable
 */
export enum UnitFormat {
    Short = 'short',
    Long = 'long',
    Hidden = 'hidden',
}

/**
 * @stable
 */
export enum TimeFormat {
    S = 'S',
    MS = 'MS',
    HM = 'HM',
    HMS = 'HMS',
    DHMS = 'DHMS',
}

/**
 * @stable
 *
 * @member unitFormat The display option of the time unit names, for example as 'hours' or 'h'.
 * @member timeFormat A string representing the time format to be considered, `DHMS`.
 * @member hideZeros A boolean whether to hide units with value equal to 0 to the left and to the right.
 */
export interface ClockOptions {
    unitFormat?: UnitFormat;
    timeFormat?: TimeFormat;
    hideZeros?: boolean;
}
