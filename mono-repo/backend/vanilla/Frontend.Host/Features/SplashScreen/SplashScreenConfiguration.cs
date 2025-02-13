using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Host.Features.SplashScreen;

internal interface ISplashScreenConfiguration
{
    IDslExpression<bool> IsEnabled { get; }
}

internal class SplashScreenConfiguration(IDslExpression<bool> isEnabled) : ISplashScreenConfiguration
{
    public const string FeatureName = "VanillaFramework.Web.UI.SplashScreen";

    public IDslExpression<bool> IsEnabled { get; set; } = isEnabled;
}
