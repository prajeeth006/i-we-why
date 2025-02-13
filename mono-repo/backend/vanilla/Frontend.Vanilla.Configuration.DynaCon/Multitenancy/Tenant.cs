using System;
using System.Threading;
using Frontend.Vanilla.Configuration.DynaCon.LocalOverrides;
using Frontend.Vanilla.Configuration.DynaCon.Reporting;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.Configuration.DynaCon.Multitenancy;

/// <summary>
/// All runtime stuff related to a tenant.
/// </summary>
internal interface ITenant
{
    ICurrentChangesetResolver ChangesetResolver { get; }
    IConfigurationReporter Reporter { get; }
    IConfigurationOverridesService OverridesService { get; }
    UtcDateTime StartTime { get; }
    UtcDateTime LastAccessTime { get; set; }
    long AccessCount { get; }
    IDisposable ServiceScope { get; }
}

internal sealed class Tenant(
    ICurrentChangesetResolver changesetResolver,
    IConfigurationReporter reporter,
    IConfigurationOverridesService overridesService,
    UtcDateTime startTime,
    IDisposable serviceScope)
    : ITenant
{
    public ICurrentChangesetResolver ChangesetResolver { get; } = changesetResolver;
    public IConfigurationReporter Reporter { get; } = reporter;
    public IConfigurationOverridesService OverridesService { get; } = overridesService;
    public UtcDateTime StartTime { get; } = startTime;
    public IDisposable ServiceScope { get; } = serviceScope;

    private volatile Tuple<UtcDateTime> lastAccessTime = Tuple.Create(default(UtcDateTime));
    private long accessCount;

    public UtcDateTime LastAccessTime
    {
        get => lastAccessTime.Item1;
        set
        {
            lastAccessTime = Tuple.Create(value);
            Interlocked.Increment(ref accessCount);
        }
    }

    public long AccessCount => Interlocked.Read(ref accessCount);
}
