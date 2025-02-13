using System;
using Frontend.Vanilla.Core.Validation.Annotations;

namespace Frontend.Vanilla.Features.Diagnostics.Health;

/// <summary>
/// Configuration of health checks execution.
/// </summary>
internal interface IHealthReportConfiguration
{
    TimeSpan HealthCheckTimeout { get; }
}

internal sealed class HealthReportConfiguration : IHealthReportConfiguration
{
    public const string FeatureName = "VanillaFramework.Diagnostics.HealthReport";

    [MinimumTimeSpan("00:00:01")]
    public TimeSpan HealthCheckTimeout { get; set; }
}
