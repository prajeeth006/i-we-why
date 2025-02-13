using System;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.IO;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Utils;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Configuration.DynaCon.FileFallback;

/// <summary>Actual file handling if particular fallback is enabled.</summary>
internal interface IFallbackFileHandler<TData>
    where TData : class
{
    RootedPath Path { get; }
    FileProperties GetProperties();
    TData Read();
    Task<TData> ReadAsync(CancellationToken cancellationToken);
    void Write(TData data);
}

internal abstract class FallbackFileHandlerBase<TData> : IFallbackFileHandler<TData>
    where TData : class
{
    TData IFallbackFileHandler<TData>.Read()
        => ExecutionMode.ExecuteSync(ReadAsync);

    Task<TData> IFallbackFileHandler<TData>.ReadAsync(CancellationToken cancellationToken)
        => ReadAsync(ExecutionMode.Async(cancellationToken));

    public abstract RootedPath Path { get; }
    public abstract FileProperties GetProperties();
    public abstract Task<TData> ReadAsync(ExecutionMode mode);
    public abstract void Write(TData data);
}

internal sealed class FallbackFileHandler<TData>(
    IFallbackFileDataHandler<TData> dataHandler,
    IFileSystem fileSystem,
    GetAppIdentifierHandler getAppIdentifier,
    ILogger log)
    : FallbackFileHandlerBase<TData>
    where TData : class
{
    public override RootedPath Path { get; } = dataHandler.Path ?? throw new VanillaBugException(); // This should not be created if fallback disabled -> fail fast
    private readonly SemaphoreSlim fileSystemSemaphore = new (initialCount: 1, maxCount: 1);

    public override FileProperties GetProperties()
    {
        using (fileSystemSemaphore.WaitDisposable())
            return fileSystem.GetFileProperties(Path) ?? throw new FileNotFoundException(null, Path);
    }

    public override async Task<TData> ReadAsync(ExecutionMode mode)
    {
        try
        {
            string json;

            using (await fileSystemSemaphore.WaitDisposableAsync(mode))
                json = await fileSystem.ReadFileTextAsync(mode, Path);

            var dto = JsonConvert.DeserializeObject<FallbackDto>(json)
                      ?? throw new JsonException($"Deserialized null from json '{json}'.");

            if (dto.Parameters?.SetEquals(dataHandler.Parameters) != true)
                throw new Exception("Configuration corresponds to different context."
                                    + " Aren't multiple apps using the same fallback file?"
                                    + $" Wasn't there recently a rollout which changed set of services or their versions?{Environment.NewLine}"
                                    + $"Parameters of this app: {dataHandler.Parameters.Join()}.{Environment.NewLine}"
                                    + $"Parameters in the fallback file: {dto.Parameters?.Join()}.");

            return dataHandler.Deserialize(dto);
        }
        catch (Exception ex)
        {
            throw new Exception($"Failed getting fallback {typeof(TData).Name} from file '{dataHandler.Path}'.", ex);
        }
    }

    public override void Write(TData data)
    {
        var currentAppId = getAppIdentifier();

        try
        {
            var dto = dataHandler.Serialize(data);

            dto.Parameters = dataHandler.Parameters.ToHashSet();
            dto.AppIdentifier = currentAppId;

            var json = JsonConvert.SerializeObject(dto, Formatting.Indented);

            using (fileSystemSemaphore.WaitDisposable())
                fileSystem.WriteFile(Path, json);
        }
        catch (Exception ex)
        {
            log.LogError(
                ex,
                "Failed writing {dataType} to {fallbackFile}. {currentAppId} versus one that wrote file last time: {conflictingAppId}",
                typeof(TData).Name,
                dataHandler.Path?.Value,
                currentAppId,
                ReadAppIdentifierFromFile());
        }
    }

    private string? ReadAppIdentifierFromFile()
    {
        try
        {
            string json;
            using (fileSystemSemaphore.WaitDisposable())
                json = fileSystem.ReadFileText(Path);

            var dto = JsonConvert.DeserializeObject<FallbackDto>(json);

            return dto?.AppIdentifier;
        }
        catch
        {
            return null;
        }
    }
}
