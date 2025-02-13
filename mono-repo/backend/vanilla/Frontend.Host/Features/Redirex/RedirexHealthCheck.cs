using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Host.Features.Redirex;

internal sealed class RedirexHealthCheck(IRedirexService service, IRedirexConfiguration config) : IHealthCheck
{
    public bool IsEnabled => config.Enabled;

    public HealthCheckMetadata Metadata { get; } = new (
        name: "Redirex",
        description: "Checks availability & functionality of redirex api service.",
        whatToDoIfFailed: "All details are provided in the Error.",
        configurationFeatureName: RedirexConfiguration.FeatureName,
        severity: HealthCheckSeverity.Default,
        documentationUri: new Uri("http://docs.redirex.intranet/"));

    public async Task<HealthCheckResult> ExecuteAsync(CancellationToken cancellationToken)
    {
        if (!config.Enabled)
        {
            return HealthCheckResult.DisabledFeature;
        }

        try
        {
            var page = await service.HealthCheckAsync(cancellationToken);

            return HealthCheckResult.CreateSuccess(new
            {
                RequestUrl = page.Request.Url,
                RequestHeaders = page.Request.Headers,
                Response = page.ToString(),
                ResponseContent = MessageUtil.Truncate(page.Content.DecodeToString(), maxLength: 200),
            });
        }
        catch (Exception ex)
        {
            return HealthCheckResult.CreateFailed(ex);
        }
    }
}
