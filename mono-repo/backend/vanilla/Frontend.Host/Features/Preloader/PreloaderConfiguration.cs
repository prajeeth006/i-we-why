using Frontend.Vanilla.Core.Configuration;

namespace Frontend.Host.Features.Preloader;

internal interface IPreloaderConfiguration : IDisableableConfiguration
{
    string ManifestKey { get; }
}

internal sealed class PreloaderConfiguration : IPreloaderConfiguration
{
    public const string FeatureName = "Host.Features.Preloader";
    public bool IsEnabled { get; set; }

    public string ManifestKey { get; set; } = string.Empty;
}
