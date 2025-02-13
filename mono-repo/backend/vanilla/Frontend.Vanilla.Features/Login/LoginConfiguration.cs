using System.ComponentModel.DataAnnotations;
using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Vanilla.Features.Login;

internal interface ILoginConfiguration
{
    [Required]
    IDslExpression<bool> IsEnabledCondition { get; }

    [Required]
    public bool IsMobileLoginEnabled { get; }

    [Required]
    public bool IsReCaptchaEnabled { get; }

    int ConnectCardVersion { get; }
    int? Version { get; }
    public string VanillaIdToken { get; }
}

internal sealed class LoginConfiguration(
    IDslExpression<bool> isEnabledCondition,
    bool isMobileLoginEnabled,
    bool isReCaptchaEnabled,
    int connectCardVersion,
    int? version,
    string vanillaIdToken)
    : ILoginConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.Login";

    public IDslExpression<bool> IsEnabledCondition { get; } = isEnabledCondition;
    public bool IsMobileLoginEnabled { get; } = isMobileLoginEnabled;
    public bool IsReCaptchaEnabled { get; } = isReCaptchaEnabled;
    public int ConnectCardVersion { get; } = connectCardVersion;
    public int? Version { get; } = version;
    public string VanillaIdToken { get; } = vanillaIdToken;
}
