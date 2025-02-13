using System.Collections.Generic;

namespace Frontend.Vanilla.Features.Cookies;

internal interface IDynaConCookieConfiguration
{
    /// <summary>
    /// Criticality: Security.
    /// </summary>
    string DefaultSameSiteMode { get; }
    IReadOnlyList<string> EncodeValueInCookieDsl { get; }
    string AuthCookieSameSiteMode { get; }
    bool SetPartitionedState { get; }
}

internal sealed class DynaConCookieConfiguration(
    string defaultSameSiteMode,
    IReadOnlyList<string> encodeValueInCookieDsl,
    string authCookieSameSiteMode,
    bool setPartitionedState)
    : IDynaConCookieConfiguration
{
    public const string FeatureName = "VanillaFramework.Web.Cookies";

    public string DefaultSameSiteMode { get; } = defaultSameSiteMode;
    public IReadOnlyList<string> EncodeValueInCookieDsl { get; } = encodeValueInCookieDsl;
    public string AuthCookieSameSiteMode { get; } = authCookieSameSiteMode;
    public bool SetPartitionedState { get; } = setPartitionedState;
}
