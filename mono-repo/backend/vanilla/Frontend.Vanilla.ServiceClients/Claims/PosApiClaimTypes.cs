using System.ComponentModel;
using System.Security.Claims;

namespace Frontend.Vanilla.ServiceClients.Claims;

/// <summary>
/// Constants for claims issued by PosAPI.
/// </summary>
public static class PosApiClaimTypes // DescriptionAttribute is used on /health/claims page
{
    /// <summary>
    /// Primary user name used on web layer. Most likely used also for login.
    /// </summary>
    [Description("Primary user name used on web layer. Most likely used also for login.")]
    public const string Name = ClaimTypes.Name;

    /// <summary>
    /// Unique string identifier of the user's account in general.
    /// </summary>
    [Description("Unique string identifier of the user's account in general.")]
    public const string AccountName = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";

    /// <summary>
    /// ID of the user's account category.
    /// </summary>
    [Description("ID of the user's account category.")]
    public const string AccountCategoryId = "http://api.bwin.com/v3/user/accountcategoryId";

    /// <summary>
    /// Unique numeric identifier of the user's account on BWIN labels.
    /// </summary>
    [Description("Unique numeric identifier of the user's account on BWIN labels.")]
    public const string BwinAccountId = "http://api.bwin.com/v3/user/nameidentifier";

    /// <summary>
    /// Unique identifier of the user's account on Party Gaming labels.
    /// </summary>
    [Description("Unique identifier of the user's account on Party Gaming labels.")]
    public const string PGAccountId = "http://api.bwin.com/v3/user/pg/nameidentifier";

    /// <summary>
    /// Unique identifier of the user's account on GVC labels.
    /// </summary>
    [Description("Unique identifier of the user's account on GVC labels.")]
    public const string GvcAccountId = "http://api.bwin.com/v3/user/external/nameidentifier";

    /// <summary>
    /// Unique token to identify the user on the backend during his session.
    /// </summary>
    [Description("Unique token to identify the user on the backend during his session.")]
    public const string UserToken = "http://api.bwin.com/v3/user/usertoken";

    /// <summary>
    /// Unique token to identify the user’s session on the backend.
    /// </summary>
    [Description("Unique token to identify the user’s session on the backend.")]
    public const string SessionToken = "http://api.bwin.com/v3/user/sessiontoken";

    /// <summary>
    /// Single sign-on token usable especially for transferring authentication state from native app to related website which it embeds.
    /// </summary>
    [Description("Single sign-on token usable especially for transferring authentication state from native app to related website which it embeds.")]
    public const string SsoToken = "http://api.bwin.com/v3/user/ssotoken";

    /// <summary>
    /// Time offset from UTC expressed in minutes according to <see cref="TimeZoneId" />.
    /// </summary>
    [Description("Time offset from UTC expressed in minutes according to timezone claim.")]
    public const string UtcOffsetMinutes = "http://api.bwin.com/v3/user/utcoffset";

    /// <summary>
    /// ID of the timezone that user has chosen in the settings/registration.
    /// </summary>
    [Description("ID of the timezone that user has chosen in the settings/registration.")]
    public const string TimeZoneId = "http://api.bwin.com/v3/user/timezone";

    /// <summary>
    /// ID of the currency that user has chosen in the settings/registration.
    /// </summary>
    [Description("ID of the currency that user has chosen in the settings/registration.")]
    public const string CurrencyId = "http://api.bwin.com/v3/user/currency";

    /// <summary>
    /// .NET name of the culture that user has chosen in the settings/registration.
    /// </summary>
    [Description(".NET name of the culture that user has chosen in the settings/registration.")]
    public const string CultureName = "http://api.bwin.com/v3/user/culture";

    /// <summary>
    /// ID of nationality that user has chosen in the settings/registration.
    /// </summary>
    [Description("ID of nationality that user has chosen in the settings/registration.")]
    public const string NationalityId = "http://api.bwin.com/v3/user/nationality";

    /// <summary>
    /// ID of pending workflow type that user must complete to be fully authenticated.
    /// </summary>
    [Description("ID of pending workflow type that user must complete to be fully authenticated.")]
    public const string WorkflowTypeId = "http://api.bwin.com/v3/user/workflowtype";

    /// <summary>
    /// The screen name to be shown in some games that user has specified in the settings/registration.
    /// </summary>
    [Description("The screen name to be shown in some games that user has specified in the settings/registration.")]
    public const string ScreenName = "http://api.bwin.com/v3/user/screenname";

    /// <summary>
    /// The email that user has specified in the settings/registration.
    /// </summary>
    [Description("The email that user has specified in the settings/registration.")]
    public const string Email = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/email";

    /// <summary>
    /// Indicates whether the user is playing with real money.
    /// </summary>
    [Description("Indicates whether the user is playing with real money.")]
    public const string IsRealMoneyPlayer = "http://api.bwin.com/v3/user/realplayer";

    /// <summary>
    /// Indicates whether the user was migrated from external platform.
    /// </summary>
    [Description("Indicates whether the user was migrated from external platform.")]
    public const string IsMigratedFromExternalPlatform = "http://api.bwin.com/v3/user/isMigratedFromExternalPlatform";

    /// <summary>
    /// ID of the jurisdiction that applies for the user according to the label, hist country etc.
    /// </summary>
    [Description("ID of the jurisdiction that applies for the user according to the label, hist country etc.")]
    public const string JurisdictionId = "http://api.bwin.com/v3/user/jurisdiction";

    /// <summary>
    /// Unique identifier of the user according to document issued for the user by state authorities.
    /// It varies by label and country e.g. social security number, documento nacional de identidad, tax number...
    /// </summary>
    [Description(
        "Unique identifier of the user according to document issued for the user by state authorities."
        + " It varies by label and country e.g. social security number, documento nacional de identidad, tax number...")]
    public const string LegalDocumentId = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/privatepersonalidentifier";

    /// <summary>
    /// User's title that he has specified in the settings/registration e.g. Mr, Prof, Princess...
    /// </summary>
    [Description("User's title that he has specified in the settings/registration e.g. Mr, Prof, Princess...")]
    public const string Title = "http://api.bwin.com/v3/user/title";

    /// <summary>
    /// First name of the user that he has specified in the settings/registration.
    /// </summary>
    [Description("First name of the user that he has specified in the settings/registration.")]
    public const string FirstName = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname";

    /// <summary>
    /// Last name of the user that he has specified in the settings/registration.
    /// </summary>
    [Description("Last name of the user that he has specified in the settings/registration.")]
    public const string LastName = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname";

    /// <summary>
    /// Second last name of the user that he has specified in the settings/registration.
    /// </summary>
    [Description("Second last name of the user that he has specified in the settings/registration.")]
    public const string SecondLastName = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/secondsurname";

    /// <summary>
    /// Indicates if user is partially registered.
    /// </summary>
    [Description("Indicates if user is partially registered.")]
    public const string IsPartiallyRegistered = "http://api.bwin.com/v3/user/isPartiallyRegistered";

    /// <summary>
    /// Indicates if user complies under UK gambling rules.
    /// </summary>
    [Description("Indicates if user complies under UK gambling rules.")]
    public const string IsUkGcPlayer = "http://api.bwin.com/v3/user/isUkGcPlayer";

    /// <summary>
    /// Indicates user's vip level.
    /// </summary>
    [Description("Indicates user's vip level.")]
    public const string VipLevel = "http://api.bwin.com/v3/user/vipLevel";

    /// <summary>
    /// Indicates user's tier code.
    /// </summary>
    [Description("Indicates user's tier code.")]
    public const string TierCode = "http://api.bwin.com/v3/user/tierCode";

    /// <summary>
    /// Indicates user's tier code.
    /// </summary>
    [Description("Indicates user's account business phase (in-shop, online).")]
    public const string AccBusinessPhase = "http://api.bwin.com/v3/user/accBusinessPhase";

    /// <summary>
    /// Indicates if user's registration completed.
    /// </summary>
    [Description("Indicates if user's registration completed.")]
    public const string RegistrationCompleted = "http://api.bwin.com/v3/user/registrationCompleted";

    /// <summary>
    /// Claims related to user's address.
    /// </summary>
    public static class Address
    {
        /// <summary>
        /// ID of the country that user has specified in the settings/registration.
        /// </summary>
        [Description("ID of the country that user has specified in the settings/registration.")]
        public const string CountryId = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/country";

        /// <summary>
        /// Name of the region that user has specified in the settings/registration.
        /// </summary>
        [Description("Name of the region that user has specified in the settings/registration.")]
        public const string Region = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/stateorprovince";

        /// <summary>
        /// Name of the city that user has specified in the settings/registration.
        /// </summary>
        [Description("Name of the city that user has specified in the settings/registration.")]
        public const string City = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/locality";

        /// <summary>
        /// Street address that user has specified in the settings/registration.
        /// </summary>
        [Description("Street address that user has specified in the settings/registration.")]
        public const string Street = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/streetaddress";

        /// <summary>
        /// Additional part of the address that user has specified in the settings/registration.
        /// </summary>
        [Description("Additional part of the address that user has specified in the settings/registration.")]
        public const string Additional = "http://api.bwin.com/v3/user/address2";

        /// <summary>
        /// Postal code of the address that user has specified in the settings/registration.
        /// </summary>
        [Description("Postal code of the address that user has specified in the settings/registration.")]
        public const string PostalCode = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/postalcode";
    }

    /// <summary>
    /// Claims related to location resolved by GeoIP service.
    /// </summary>
    public static class GeoIP
    {
        /// <summary>
        /// ID of the country determined using GeoIP service e.g. 'US'.
        /// </summary>
        [Description("ID of the country determined using GeoIP service e.g. 'US'.")]
        public const string CountryId = "http://api.bwin.com/v3/geoip/country";

        /// <summary>
        /// Name of the region determined using GeoIP service e.g. 'New Jersey'.
        /// </summary>
        [Description("Name of the region determined using GeoIP service e.g. 'New Jersey'.")]
        public const string Region = "http://api.bwin.com/v3/geoip/stateorprovince";

        /// <summary>
        /// Name of the city determined using GeoIP service e.g. 'West Orange'.
        /// </summary>
        [Description("Name of the city determined using GeoIP service e.g. 'West Orange'.")]
        public const string City = "http://api.bwin.com/v3/geoip/locality";
    }

    /// <summary>
    /// Claims related to the birth of the user.
    /// </summary>
    public static class Birth
    {
        /// <summary>
        /// Date when the user was born in format 'yyyy-MM-dd' e.g. '1940-03-02'.
        /// </summary>
        [Description("Date when the user was born in format 'yyyy-MM-dd' e.g. '1940-03-02'.")]
        public const string Date = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/dateofbirth";

        /// <summary>
        /// ID of the country where the user was born. Specified in the settings/registration.
        /// </summary>
        [Description("ID of the country where the user was born. Specified in the settings/registration.")]
        public const string CountryId = "http://api.bwin.com/v3/user/birthcountry";

        /// <summary>
        /// ID of the region when the user was born. Specified in the settings/registration.
        /// </summary>
        [Description("ID of the region when the user was born. Specified in the settings/registration.")]
        public const string RegionId = "http://api.bwin.com/v3/user/birthstateorprovince";

        /// <summary>
        /// ID of the city when the user was born. Specified in the settings/registration.
        /// </summary>
        [Description("ID of the city when the user was born. Specified in the settings/registration.")]
        public const string CityId = "http://api.bwin.com/v3/user/birthlocality";
    }

    /// <summary>
    /// Claims related to user's phone numbers.
    /// </summary>
    public static class Phone
    {
        /// <summary>
        /// Claims related to user's home phone.
        /// </summary>
        public static class Home
        {
            /// <summary>
            /// Number of home phone that user has specified in the settings/registration e.g. '9878998789'.
            /// </summary>
            [Description("Number of home phone that user has specified in the settings/registration e.g. '9878998789'.")]
            public const string Number = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/homephone";

            /// <summary>
            /// Country predial of home phone that user has specified in the settings/registration. It's without without leading '+' e.g. '44'.
            /// </summary>
            [Description("Country predial of home phone that user has specified in the settings/registration. It's without without leading '+' e.g. '44'.")]
            public const string CountryPredial = "http://api.bwin.com/v3/user/phonecountrycode";
        }

        /// <summary>
        /// Claims related to user's mobile phone.
        /// </summary>
        public static class Mobile
        {
            /// <summary>
            /// Number of mobile phone that user has specified in the settings/registration e.g. '9878998789'.
            /// </summary>
            [Description("Number of mobile phone that user has specified in the settings/registration e.g. '9878998789'.")]
            public const string Number = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone";

            /// <summary>
            /// Country predial of mobile phone that user has specified in the settings/registration. It's without without leading '+' e.g. '44'.
            /// </summary>
            [Description("Country predial of mobile phone that user has specified in the settings/registration. It's without without leading '+' e.g. '44'.")]
            public const string CountryPredial = "http://api.bwin.com/v3/user/mobilecountrycode";
        }
    }

    // TODO investigate if needed
    [Description("OBSOLETE!")]
    internal const string Redirect = "http://api.bwin.com/v3/redirect";

    // TODO Use CultureName instead
    [Description("OBSOLETE!")]
    internal const string LanguageCode = "http://api.bwin.com/v3/user/language";
}
