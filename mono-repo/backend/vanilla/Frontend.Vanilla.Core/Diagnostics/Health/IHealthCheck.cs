using System.Threading;
using System.Threading.Tasks;

namespace Frontend.Vanilla.Core.Diagnostics.Health;

/// <summary>
/// Checks the health state of the application component.
/// </summary>
public interface IHealthCheck
{
    /// <summary>
    /// Indicates if health check should be enabled/visible.
    /// </summary>
    bool IsEnabled { get; }

    /// <summary>Gets the metadata describing this check.</summary>
    HealthCheckMetadata Metadata { get; }

    /// <summary>Executes the check.</summary>
    Task<HealthCheckResult> ExecuteAsync(CancellationToken cancellationToken);
}
