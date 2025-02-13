using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Features.SuspiciousRequest;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;

namespace Frontend.Host.Features.SuspiciousRequest;

internal sealed class SuspiciousRequestMiddleware(
    RequestDelegate next,
    IEndpointMetadata endpointMetadata,
    ISuspiciousRequestConfiguration suspiciousRequestConfiguration)
    : Middleware(next)
{
    private const string DiagnosticHeader = "X-Vanilla-Suspicious-Request";
    private const string DiagnosticQueryString = "dsr";

    public override Task InvokeAsync(HttpContext httpContext)
    {
        if (!endpointMetadata.Contains<ServesHtmlDocumentAttribute>() || httpContext.Request.Query.Count == 0 ||
            !suspiciousRequestConfiguration.QueryStringRules.Any())
            return Next(httpContext);

        return EvaluateRegexAsync();

        async Task EvaluateRegexAsync()
        {
            var queryString = httpContext.Request.Query;
            var rule = suspiciousRequestConfiguration.QueryStringRules
                .FirstOrDefault(r => queryString.Any(qs => r.Value.Regex.IsMatch(qs.Value.ToString()))).Value;

            if (rule == null)
            {
                await Next(httpContext);

                return;
            }

            var targetBuilder = new UriBuilder
            {
                Path = httpContext.Request.Path, Query = QueryUtil.Build(new Dictionary<string, StringValues>
                {
                    { DiagnosticQueryString, "1" },
                }),
            };
            httpContext.Response.Headers.Append(DiagnosticHeader, rule.Description);
            httpContext.Response.Redirect(targetBuilder.Uri.PathAndQuery, source: this);
        }
    }
}
