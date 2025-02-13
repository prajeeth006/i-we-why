using System.ComponentModel.DataAnnotations;
using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Vanilla.Features.Login.Integration;

internal interface ILoginIntegrationConfiguration
{
    string Type { get; }
    LoginIntegrationOptions Options { get; }
}

internal sealed class LoginIntegrationConfiguration(string type, LoginIntegrationOptions options) : ILoginIntegrationConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.LoginIntegration";

    [Required]
    public string Type { get; set; } = type;

    public LoginIntegrationOptions Options { get; set; } = options;
}

internal sealed class LoginIntegrationOptions(
    string activeSessionUrl,
    string loginUrl,
    string logoutUrl,
    IDslExpression<bool> redirectAfterLoginCondition,
    string relayUrl,
    string standaloneLoginUrl,
    int version)
{
    public string ActiveSessionUrl { get; } = activeSessionUrl;
    public string LoginUrl { get; } = loginUrl;
    public string LogoutUrl { get; } = logoutUrl;
    public IDslExpression<bool>? RedirectAfterLoginCondition { get; } = redirectAfterLoginCondition;
    public string RelayUrl { get; } = relayUrl;
    public string StandaloneLoginUrl { get; } = standaloneLoginUrl;
    public int Version { get; } = version;
}
