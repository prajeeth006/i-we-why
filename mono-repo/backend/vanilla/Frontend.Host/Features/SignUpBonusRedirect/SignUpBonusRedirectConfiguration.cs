namespace Frontend.Host.Features.SignUpBonusRedirect;

/// <summary>
/// Configuration for sing-up bonus redirect.
/// </summary>
internal interface ISignUpBonusRedirectConfiguration
{
    /// <summary>
    /// Gets the location of link in Sitecore which contains URL of landing page for claiming sign-up bonus.
    /// Feature is disabled if value is empty.
    /// </summary>
    string LandingPageLinkLocation { get; }

    string AlternateRedirectionLink { get; }
}

internal sealed class SignUpBonusRedirectConfiguration : ISignUpBonusRedirectConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.SignUpBonusRedirect";
    public string LandingPageLinkLocation { get; set; } = "";
    public string AlternateRedirectionLink { get; set; } = "";
}
