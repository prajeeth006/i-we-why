using Frontend.Vanilla.Core.Reflection;

namespace Frontend.Host.Features.ClientApp;

internal enum FileServerRollForwardStrategy
{
    Disable,
    LatestMinor,
    LatestPatch,
}

/// <summary>
/// ClientApp mode.
/// </summary>
public enum ClientAppMode
{
    /// <summary>
    /// Indicates mode used during development.
    /// </summary>
    DevServer,

    /// <summary>
    /// Indicates mode where client app files are located on file system inside server.
    /// </summary>
    FileSystem,

    /// <summary>
    /// Indicated mode where client app files are located on file server.
    /// </summary>
    FileServer,
}

internal interface IClientAppConfiguration
{
    ClientAppMode Mode { get; }
    Uri FileServerHost { get; }
    FileServerRollForwardStrategy FileServerRollForwardStrategy { get; }
    TimeSpan FileServerVersionCacheTime { get; }
    bool SameSiteForceHttp { get; }
    Version? ForceSpecificVersion { get; }
}

internal sealed class ClientAppConfiguration : IClientAppConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.ClientApp";

    public ClientAppMode Mode { get; set; } = ClientAppMode.FileSystem;
    public Uri FileServerHost { get; set; } = default!;

    public FileServerRollForwardStrategy FileServerRollForwardStrategy { get; set; } =
        FileServerRollForwardStrategy.LatestMinor;

    public TimeSpan FileServerVersionCacheTime { get; set; }
    public bool SameSiteForceHttp { get; set; }
    public Version? ForceSpecificVersion { get; set; }
}
