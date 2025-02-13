using System.IO.Compression;

namespace Frontend.Vanilla.Features.App;

internal sealed class CompressionLevelOptions(CompressionLevel @default, CompressionLevel? staticFiles)
{
    public CompressionLevel Default { get; } = @default;
    public CompressionLevel? StaticFiles { get; } = staticFiles;
}

/// <summary>
/// Configuration of application.
/// </summary>
internal interface IAppConfiguration
{
    bool UsesHttps { get; }
    CompressionLevelOptions CompressionLevelOptions { get; }
    bool UseSwitchMiddleware { get; }
    string[] AllowOnlyInternallyPaths { get; }
}

internal sealed class AppConfiguration(
    bool usesHttps,
    CompressionLevelOptions compressionLevelOptions,
    bool useSwitchMiddleware,
    string[] allowOnlyInternallyPaths)
    : IAppConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.App";

    public bool UsesHttps { get; set; } = usesHttps;
    public CompressionLevelOptions CompressionLevelOptions { get; } = compressionLevelOptions;
    public bool UseSwitchMiddleware { get; set; } = useSwitchMiddleware;
    public string[] AllowOnlyInternallyPaths { get; set; } = allowOnlyInternallyPaths;
}
