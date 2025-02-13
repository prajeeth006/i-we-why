using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.Core.Json.Converters;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Diagnostics.Contracts;
using Frontend.Vanilla.Diagnostics.Contracts.Health;
using Frontend.Vanilla.DomainSpecificLanguage.Json;
using Frontend.Vanilla.Features.Diagnostics.Health;
using Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.ServerUtils;
using Frontend.Vanilla.Features.DynaConVariationContext.Providers;
using Frontend.Vanilla.Features.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.Health;

internal sealed class HealthDiagnosticController(
    IHealthCheckExecutor checkExecutor,
    IInternalRequestEvaluator requestEvaluator,
    IEnvironmentProvider environmentProvider,
    IClientIPResolver clientIpResolver,
    IServerIPProvider serverIpProvider,
    ILogger<HealthDiagnosticController> log)
    : IDiagnosticApiController
{
    private readonly JsonSerializer serializer = new ()
    {
        Converters =
        {
            new StringEnumConverter(),
            new IsoDateTimeConverter { DateTimeFormat = DiagnosticConstants.DateTimeFormat },
            new SimpleExceptionConverter(),
            new DslExpressionDiagnosticJsonConverter(),
        },
    };

    public DiagnosticsRoute GetRoute() => DiagnosticApiUrls.Health.UrlTemplate;

    public async Task<object?> ExecuteAsync(HttpContext httpContext)
    {
        var results = await checkExecutor.ExecuteAsync(httpContext.RequestAborted);
        var isScom = httpContext.Request.Headers[HttpHeaders.UserAgent].ToString() == UserAgentTypes.Scom;
        var allPassed = results.Where(r => r.Severity == HealthCheckSeverity.Critical).All(r => r.Passed);

        if (!allPassed && isScom)
        {
            results = results.Where(r => !r.Passed).ToList();

            foreach (var result in results)
            {
                log.LogError(SemanticLoggingMessageTemplate.Health, result.Name, result.Error);
            }
        }

        var isInternal = requestEvaluator.IsInternal();
        var allDetails = results.ToDictionary(
            r => r.Severity == HealthCheckSeverity.Critical ? $"[{r.Severity.ToString()}] {r.Name}" : r.Name,
            r => !isInternal ? new HealthCheckSummary { Passed = r.Passed } : r); // Hide all details for public requests

        var serverIp = serverIpProvider.IPAddress?.ToString();
        var model = new HealthReportResult(
            serverIp?.IndexOf('.') is { } i and > 0 ? serverIp.Substring(i + 1) : serverIp,
            clientIpResolver.Resolve().ToString(),
            environmentProvider.Environment,
            JObject.FromObject(allDetails, serializer),
            allPassed);

        return model;
    }
}
