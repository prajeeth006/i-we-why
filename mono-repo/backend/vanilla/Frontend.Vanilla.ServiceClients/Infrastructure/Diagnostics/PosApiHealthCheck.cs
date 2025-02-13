using System;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.ServiceClients.Services.Common;

namespace Frontend.Vanilla.ServiceClients.Infrastructure.Diagnostics;

/// <summary>
/// Checks that Pos API is up and running.
/// </summary>
internal sealed class PosApiHealthCheck(ITrafficHealthState trafficHealthState, IPosApiCommonServiceInternal posApiCommonService)
    : IHealthCheck
{
    public bool IsEnabled => true;

    public HealthCheckMetadata Metadata { get; } = new HealthCheckMetadata(
        name: "PosAPI",
        description: "Checks whether the PosAPI endpoint is available. Succeeds if there was either a successful PosAPI request according to the configuration.",
        whatToDoIfFailed: "Check the connectivity to PosAPI according to the Configuration.",
        severity: HealthCheckSeverity.Critical,
        documentationUri: new Uri("https://docs.vanilla.intranet/service-clients.html"),
        configurationFeatureName: ServiceClientsConfigurationBuilder.FeatureName);

    public async Task<HealthCheckResult> ExecuteAsync(CancellationToken ct)
    {
        var result = trafficHealthState.Get();

        // Not Passed -> double-check b/c false alarms annoy monitoring guys
        if (result == null || result.Error != null)
        {
            result = await GetFreshResultAsync(ct);
            var details = GetResultDetails(RequestDesc, isFreshHealth: false);
            trafficHealthState.Set(result.Error == null ? HealthCheckResult.CreateSuccess(details) : HealthCheckResult.CreateFailed(result.Error, details));
        }

        return result;
    }

    private async Task<HealthCheckResult> GetFreshResultAsync(CancellationToken ct)
    {
        var details = GetResultDetails(RequestDesc, isFreshHealth: true);

        try
        {
            var languages = await posApiCommonService.GetFreshLanguagesAsync(ct);

            return languages.Count > 0
                ? HealthCheckResult.CreateSuccess(details)
                : HealthCheckResult.CreateFailed("No languages received from the endpoint.", details);
        }
        catch (Exception ex)
        {
            return HealthCheckResult.CreateFailed(ex, details);
        }
    }

    private const string RequestDesc = "to GET languages executed by health check itself";

    public static string GetResultDetails(object requestDesc, bool isFreshHealth)
        => $"Based on {(isFreshHealth ? "FRESH" : "CACHED result of recent")} request {requestDesc}.";
}
