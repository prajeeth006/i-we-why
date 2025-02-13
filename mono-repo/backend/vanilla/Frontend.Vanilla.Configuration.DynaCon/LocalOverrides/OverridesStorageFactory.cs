using Frontend.Vanilla.Configuration.DynaCon.LocalOverrides.File;
using Frontend.Vanilla.Configuration.DynaCon.LocalOverrides.Session;
using Frontend.Vanilla.Configuration.DynaCon.Multitenancy;
using Frontend.Vanilla.Core.IO;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.Utils;
using Microsoft.Extensions.Caching.Memory;

namespace Frontend.Vanilla.Configuration.DynaCon.LocalOverrides;

/// <summary>
/// Creates <see cref="IOverridesStorage" /> according to configuration. Makes sure that all dependencies exist on startup.
/// </summary>
internal sealed class OverridesStorageFactory(
    DynaConEngineSettings engineSettings,
    TenantSettings tenantSettings,
    IFileSystem fileSystem,
    IDynaConOverridesSessionIdentifier sessionIdentifier)
    : LambdaFactory<IOverridesStorage>(() => engineSettings.LocalOverridesMode switch
    {
        LocalOverridesMode.File => new FileOverridesStorage(tenantSettings, fileSystem),
        LocalOverridesMode.Session => new SessionOverridesStorage(sessionIdentifier, new MemoryCache(new MemoryCacheOptions())),
        LocalOverridesMode.Disabled => new DisabledOverridesStorage(),
        _ => throw new VanillaBugException(),
    }) { }
