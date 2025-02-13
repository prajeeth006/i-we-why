using System;

namespace Frontend.Vanilla.Features.UI;

internal interface ILoadingIndicatorConfiguration
{
    TimeSpan DefaultDelay { get; }
    TimeSpan ExternalNavigationDelay { get; }
    string SpinnerContent { get; }
    string DisabledUrlPattern { get; }
}

internal class LoadingIndicatorConfiguration(TimeSpan defaultDelay, TimeSpan externalNavigationDelay, string spinnerContent, string disabledUrlPattern)
    : ILoadingIndicatorConfiguration
{
    public const string FeatureName = "VanillaFramework.Web.UI.LoadingIndicator";

    public TimeSpan DefaultDelay { get; set; } = defaultDelay;
    public TimeSpan ExternalNavigationDelay { get; set; } = externalNavigationDelay;
    public string SpinnerContent { get; set; } = spinnerContent;
    public string DisabledUrlPattern { get; set; } = disabledUrlPattern;
}
