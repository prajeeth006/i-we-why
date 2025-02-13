#nullable enable

using System.Collections.Generic;
using Frontend.Vanilla.Core.Abstractions;
using Frontend.Vanilla.Core.Time;

namespace Frontend.Vanilla.ServiceClients.Infrastructure.Caching;

/// <summary>
/// Gets info used for cache diagnostics.
/// </summary>
internal interface IPosApiCacheDiagnostics
{
    IDictionary<string, object?> GetInfo();
}

internal sealed class PosApiCacheDiagnostics(IEnvironment environment, IClock clock) : IPosApiCacheDiagnostics
{
    public IDictionary<string, object?> GetInfo()
        => new Dictionary<string, object?>
        {
            { "Time", clock.UtcNow },
            { "ServerName", environment.MachineName },
        };
}
