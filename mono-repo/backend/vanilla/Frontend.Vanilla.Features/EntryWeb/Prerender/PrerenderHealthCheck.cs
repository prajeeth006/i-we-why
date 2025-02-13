using System;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Features.WebAbstractions;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.EntryWeb.Prerender;

/// <summary>
/// Checks connectivity of <see cref="IPrerenderService" />.
/// </summary>
internal sealed class PrerenderHealthCheck(IPrerenderService service, Func<IPrerenderConfiguration> configFunc, IHttpContextAccessor httpContextAccessor)
    : IHealthCheck
{
    public bool IsEnabled => configFunc().Enabled;

    public HealthCheckMetadata Metadata { get; } = new (
        name: "Prerender",
        description: "Checks availability & functionality of Prerender service used for prerendering web pages for crawlers.",
        whatToDoIfFailed: "All details are provided in the Error.",
        configurationFeatureName: PrerenderConfiguration.FeatureName,
        severity: HealthCheckSeverity.Default,
        documentationUri: new Uri("https://vie.git.bwinparty.com/vanilla/prerender/-/wikis/home"));

    public async Task<HealthCheckResult> ExecuteAsync(CancellationToken cancellationToken)
    {
        var config = configFunc();

        if (!config.Enabled)
        {
            return HealthCheckResult.DisabledFeature;
        }

        var correlationId = Guid.NewGuid().ToString();

        try
        {
            var httpContext = httpContextAccessor.GetRequiredHttpContext();
            var pageUrl = httpContext.Request.GetAppBaseUrl();
            var xForwardedFor = httpContext.Request.Headers[HttpHeaders.XForwardedFor].ToString();
            var correlationHeader = httpContext.Request.Headers[HttpHeaders.XCorrelationId].ToString();

            if (!string.IsNullOrEmpty(correlationHeader))
            {
                correlationId = correlationHeader;
            }

            var page = await service.GetPrerenderedPageAsync(pageUrl, "GoogleBot", xForwardedFor, correlationId, cancellationToken);

            return HealthCheckResult.CreateSuccess(new
            {
                RequestUrl = page.Request.Url,
                RequestHeaders = page.Request.Headers,
                Response = page.ToString(),
                ResponseContent = MessageUtil.Truncate(page.Content.DecodeToString(), maxLength: 200),
                CorrelationId = correlationId,
            });
        }
        catch (Exception ex)
        {
            return HealthCheckResult.CreateFailed(ex, new { CorrelationId = correlationId });
        }
    }
}
