using Frontend.Vanilla.Core.Configuration;

namespace Frontend.Host.Features.FontPreload;

internal interface IFontPreloadConfiguration : IDisableableConfiguration
{
    string NameSearchPatternPrefix { get; }
}

internal sealed class FontPreloadConfiguration : IFontPreloadConfiguration
{
    public const string FeatureName = "Host.Features.FontPreload";
    public bool IsEnabled { get; set; }

    public string NameSearchPatternPrefix { get; set; } = string.Empty;
}
