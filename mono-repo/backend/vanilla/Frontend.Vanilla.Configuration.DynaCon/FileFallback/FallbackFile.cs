using Frontend.Vanilla.Core.IO;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Configuration.DynaCon.FileFallback;

/// <summary>
/// Manages the last valid raw version of configuration data stored in the fallback file.
/// </summary>
internal interface IFallbackFile<TData>
    where TData : class
{
    /// <summary>Null if file is disabled.</summary>
    IFallbackFileHandler<TData>? Handler { get; }
}

internal sealed class FallbackFile<TData> : IFallbackFile<TData>
    where TData : class
{
    public IFallbackFileHandler<TData>? Handler { get; }

    /// <summary>Lists all parameters to verify their availability with dependency injection.</summary>
    public FallbackFile(IFallbackFileDataHandler<TData> dataHandler, IFileSystem fileSystem, GetAppIdentifierHandler getAppIdentifier, ILogger<FallbackFile<TData>> log)
        => Handler = dataHandler.Path != null
            ? new FallbackFileHandler<TData>(dataHandler, fileSystem, getAppIdentifier, log)
            : null;
}
