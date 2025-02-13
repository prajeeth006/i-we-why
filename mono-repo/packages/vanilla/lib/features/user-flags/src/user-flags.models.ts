/**
 * @stable
 */
export interface UserFlag {
    name: string;
    value: string;
    reasonCodes?: string[];
}

export interface UserFlagsResponse {
    accountName: string;
    flags: UserFlag[];
}
