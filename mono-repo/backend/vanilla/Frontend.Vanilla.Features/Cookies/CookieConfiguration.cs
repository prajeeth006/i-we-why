using System;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Features.App;

namespace Frontend.Vanilla.Features.Cookies;

/// <summary>
/// Configuration of the cookies for the apps in order to share them across the label.
/// </summary>
public interface ICookieConfiguration
{
    /// <summary>Indicates whether to transmit cookie only over secure channels (i.e. HTTPS).</summary>
    bool Secure { get; }

    /// <summary>Gets the cookie domain dynamically resolved according to current label so it should be obtained just-in-time when processing HTTP request, not during app startup.</summary>
    TrimmedRequiredString CurrentLabelDomain { get; }

    /// <summary>Gets the default SameSite mode configured on Dynacon." />.</summary>
    SameSiteFlag DefaultSameSiteMode { get; }

    /// <summary>Gets the SameSite mode configured on Dynacon for Auth cookie (vauth)." />.</summary>
    SameSiteFlag AuthCookieSameSiteMode { get; }
}

internal sealed class CookieConfiguration(IEnvironmentProvider environmentProvider, Func<ICookieSameSiteProvider> sameSiteProvider, Func<IAppConfiguration> appConfig)
    : ICookieConfiguration
{
    private readonly Lazy<ICookieSameSiteProvider> sameSiteProvider = sameSiteProvider.ToLazy();
    private readonly Lazy<IAppConfiguration> appConfig = appConfig.ToLazy();

    public bool Secure
        => appConfig.Value.UsesHttps;

    public TrimmedRequiredString CurrentLabelDomain
        => "." + environmentProvider.CurrentDomain;

    public SameSiteFlag DefaultSameSiteMode
        => sameSiteProvider.Value.DefaultSameSiteMode;

    public SameSiteFlag AuthCookieSameSiteMode
        => sameSiteProvider.Value.AuthCookieSameSiteMode;
}
