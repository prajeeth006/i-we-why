using System.ComponentModel;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Provides generic access to user's claims.
/// </summary>
[ValueVolatility(ValueVolatility.Client)]
[Description("Provides generic access to user's claims.")]
public interface IClaimsDslProvider
{
    /// <summary>
    /// Gets the value of the user's claim of given claimType.
    /// ClaimType is case-insensitive and it can represent full URL (e.g. http://api.bwin.com/v3/geoip/stateorprovince) or just the last part (e.g. StateOrProvince).
    /// Gets empty string also if the user does not have a claim of given claimType.
    /// </summary>
    [Description(
        "Gets the value of the user's claim of given claimType." +
        " ClaimType is case-insensitive and it can represent full URL (e.g. http://api.bwin.com/v3/geoip/stateorprovince) or just the last part (e.g. StateOrProvince)." +
        " Gets empty string also if the user does not have a claim of given claimType.")]
    string? Get(string claimType);
}
