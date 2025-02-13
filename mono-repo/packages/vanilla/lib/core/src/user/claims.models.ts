/**
 * @description Represents user claim types with full name.
 *
 * @stable
 */
export enum ClaimTypeFullName {
    BackendUserId = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
    AccountId = 'http://api.bwin.com/v3/user/pg/nameidentifier',
    GlobalSession = 'http://api.bwin.com/v3/user/pg/globalsession',
    Username = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
    Country = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/country',
    GeoCountry = 'http://api.bwin.com/v3/geoip/country',
    UtcOffset = 'http://api.bwin.com/v3/user/utcoffset',
    Currency = 'http://api.bwin.com/v3/user/currency',
    RealPlayer = 'http://api.bwin.com/v3/user/realplayer',
    SsoToken = 'http://api.bwin.com/v3/user/ssotoken',
    Screenname = 'http://api.bwin.com/v3/user/screenname',
    Title = 'http://api.bwin.com/v3/user/title',
    GamingDeclarationFlag = 'http://api.bwin.com/v3/user/gamingDeclarationFlag',
    FirstName = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname',
    LastName = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname',
    Email = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/email',
    DateOfBirth = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/dateofbirth',
    SessionToken = 'http://api.bwin.com/v3/user/sessiontoken',
}
