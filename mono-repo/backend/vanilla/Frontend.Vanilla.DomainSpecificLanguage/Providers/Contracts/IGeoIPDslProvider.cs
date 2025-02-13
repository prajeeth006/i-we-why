using System.ComponentModel;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Provides geographical location information resolved based on client's IP address.
/// This is based on claims coming from PosAPI. They should be always available for all users.
/// You can see current claims at /health/claims of this website.
/// For more details ask PosAPI team, not Vanilla team.
/// </summary>
[Description("Provides geographical location information resolved based on client's IP address."
             + " This is based on claims coming from PosAPI. They are resolved based on client's IP address and should be always available for all users."
             + " You can see current claims at /health/claims of this website."
             + " For more details ask PosAPI team, not Vanilla team.")]
[ValueVolatility(ValueVolatility.Client)]
public interface IGeoIPDslProvider
{
    /// <summary>The country code based on http://api.bwin.com/v3/geoip/country claim.</summary>
    [Description("The country code based on http://api.bwin.com/v3/geoip/country claim.")]
    string GetCountry();

    /// <summary>The country name based on the GetAllCountries posApi call.</summary>
    [Description("The country name based on the GetAllCountries posApi call.")]
    string GetCountryName();

    /// <summary>The city name code based on http://api.bwin.com/v3/geoip/locality claim.</summary>
    [Description("The city name code based on http://api.bwin.com/v3/geoip/locality claim.")]
    string GetCity();

    /// <summary>The region code based on http://api.bwin.com/v3/geoip/stateorprovince claim.</summary>
    [Description("The region code based on http://api.bwin.com/v3/geoip/stateorprovince claim.")]
    string GetRegion();
}
