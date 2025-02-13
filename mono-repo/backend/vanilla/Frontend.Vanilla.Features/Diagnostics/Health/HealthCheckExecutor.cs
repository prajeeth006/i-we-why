using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Configuration.DynaCon;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.Core.Time;
using Frontend.Vanilla.Features.Globalization.Configuration;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;

namespace Frontend.Vanilla.Features.Diagnostics.Health;

/// <summary>
/// Executes health checks and returns a summary report.
/// </summary>
internal interface IHealthCheckExecutor
{
    Task<IReadOnlyList<HealthCheckSummary>> ExecuteAsync(CancellationToken cancellationToken);
}

internal sealed class HealthCheckExecutor(
    IEnumerable<IHealthCheck> checks,
    IHealthReportConfiguration healthReportConfig,
    ICurrentConfigurationResolver configResolver,
    IGlobalizationConfiguration globalizationConfig,
    ICancellationHelper cancellationHelper)
    : IHealthCheckExecutor
{
    public async Task<IReadOnlyList<HealthCheckSummary>> ExecuteAsync(CancellationToken externalCancellationToken)
    {
        CultureInfoHelper.SetCurrent(globalizationConfig.DefaultLanguage.Culture);
        using var combinedCancellation = cancellationHelper.CancelAfter(healthReportConfig.HealthCheckTimeout, externalCancellationToken);

        var tasks = checks.Where(c => c.IsEnabled).ToArray().ConvertAll(c => ExecuteCheckAsync(c, combinedCancellation.Token));

        return await Task.WhenAll(tasks);
    }

    private async Task<HealthCheckSummary> ExecuteCheckAsync(IHealthCheck check, CancellationToken cancellationToken)
    {
        var start = Stopwatch.GetTimestamp();
        var result = await ExecuteCheckSafelyAsync(check, cancellationToken);
        var elapsed = Stopwatch.GetElapsedTime(start);

        return new HealthCheckSummary
        {
            Passed = result.Error == null,
            Error = result.Error,
            Details = result.Details,
            Name = check.Metadata.Name,
            Description = check.Metadata.Description,
            Severity = check.Metadata.Severity,
            DocumentationUri = check.Metadata.DocumentationUri,
            WhatToDoIfFailed =
                "Read Error details carefully including InnerException-s. Make sure the Configuration is correct. Then ask corresponding team (usually not Vanilla) for help. "
                + check.Metadata.WhatToDoIfFailed,
            ExecutionTime = elapsed,
            Configuration = check.Metadata.ConfigurationFeatureName != null
                ? new ConfigurationSummary(
                    featureName: check.Metadata.ConfigurationFeatureName,
                    instance: configResolver.Resolve(check.Metadata.ConfigurationFeatureName, true))
                : null,
        };
    }

    private async Task<HealthCheckResult> ExecuteCheckSafelyAsync(IHealthCheck check, CancellationToken cancellationToken)
    {
        try
        {
            return await check.ExecuteAsync(cancellationToken)
                   ?? HealthCheckResult.CreateFailed("Health check returned null.");
        }
        catch (OperationCanceledException ex)
        {
            var msg = $"Health check was cancelled because it didn't execute within configured timeout {healthReportConfig.HealthCheckTimeout}.";

            return HealthCheckResult.CreateFailed(new Exception(msg, ex));
        }
        catch (Exception ex)
        {
            return HealthCheckResult.CreateFailed(ex);
        }
    }
}
