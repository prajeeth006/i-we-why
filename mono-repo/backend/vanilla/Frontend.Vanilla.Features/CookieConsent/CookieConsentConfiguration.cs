using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Vanilla.Features.CookieConsent;

internal interface ICookieConsentConfiguration
{
    IDslExpression<bool> Condition { get; }
}

internal sealed class CookieConsentConfiguration(IDslExpression<bool> condition) : ICookieConsentConfiguration
{
    public const string FeatureName = "VanillaFramework.Web.UI.CookieConsent";
    public IDslExpression<bool> Condition { get; set; } = Guard.NotNull(condition, nameof(condition));
}
