using System;
using System.IO;
using System.Threading;
using Frontend.Vanilla.Configuration.DynaCon.Multitenancy;
using Frontend.Vanilla.Core.IO;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Configuration.DynaCon.LocalOverrides.File;

/// <summary>
/// Stores config overrides in a single <see cref="TenantSettings.LocalOverridesFile" /> for all users.
/// </summary>
internal sealed class FileOverridesStorage(TenantSettings tenantSettings, IFileSystem fileSystem) : IOverridesStorage
{
    public TrimmedRequiredString CurrentContextId { get; } = $"File:{tenantSettings.Name}";
    private readonly RootedPath filePath = tenantSettings.LocalOverridesFile ?? throw new VanillaBugException();
    private volatile CancellationTokenSource manualEvictionSource = new CancellationTokenSource(); // B/c file watcher has a delay

    public IChangeToken WatchChanges()
    {
        var fileToken = fileSystem.WatchFile(filePath);

        return new CompositeChangeToken(new[] { fileToken, manualEvictionSource.GetChangeToken() });
    }

    public JObject Get()
    {
        string? text = null;

        try
        {
            text = fileSystem.ReadFileText(filePath);

            return !string.IsNullOrWhiteSpace(text)
                ? JObject.Parse(text)
                : new JObject();
        }
        catch (FileNotFoundException)
        {
            return new JObject();
        }
        catch (Exception ex)
        {
            throw new Exception($"Failed reading JSON config overrides from file '{filePath}'. Content (if already read): {text}", ex);
        }
    }

    public void Set(JObject overridesJson)
    {
        try
        {
            var jsonStr = overridesJson.ToString(Formatting.Indented);
            fileSystem.WriteFile(filePath, jsonStr);

            manualEvictionSource.Cancel();
            manualEvictionSource = new CancellationTokenSource();
        }
        catch (Exception ex)
        {
            throw new Exception($"Failed writing JSON config overrides to file '{filePath}'.", ex);
        }
    }
}
