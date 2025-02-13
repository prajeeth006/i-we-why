using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Configuration.DynaCon.Container;

namespace Frontend.Vanilla.Configuration.DynaCon.Reporting;

/// <summary>
/// Fills specific configuration status to the report.
/// This pattern is ugly, but it reduces code and if building fails, we still have some partially-filled report.
/// </summary>
internal interface IPartialConfigurationReporter
{
    Task FillAsync(ConfigurationReport report, IConfigurationSnapshot snapshot, CancellationToken cancellationToken);
}

internal abstract class SyncPartialConfigurationReporter : IPartialConfigurationReporter
{
    Task IPartialConfigurationReporter.FillAsync(ConfigurationReport report, IConfigurationSnapshot snapshot, CancellationToken cancellationToken)
    {
        Fill(report, snapshot);

        return Task.CompletedTask;
    }

    public abstract void Fill(ConfigurationReport report, IConfigurationSnapshot snapshot);
}
