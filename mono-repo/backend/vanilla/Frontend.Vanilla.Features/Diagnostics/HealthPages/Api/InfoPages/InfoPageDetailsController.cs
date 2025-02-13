using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Diagnostics.Contracts;
using Frontend.Vanilla.Diagnostics.Contracts.Info;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.InfoPages;

internal sealed class InfoPageDetailsController : IDiagnosticApiController
{
    private readonly IReadOnlyDictionary<string, IDiagnosticInfoProvider> providers;

    public InfoPageDetailsController(IEnumerable<IDiagnosticInfoProvider> providers)
        => this.providers = providers.ToDictionary(p => p.Metadata.UrlPathSegment.Value, StringComparer.OrdinalIgnoreCase);

    public DiagnosticsRoute GetRoute() => DiagnosticApiUrls.InfoPages.Details.UrlTemplate;

    public async Task<object?> ExecuteAsync(HttpContext httpContext)
    {
        var path = httpContext.Request.RouteValues.GetRequiredString(DiagnosticApiUrls.InfoPages.Details.PathParameter, "route value");
        var provider = providers.GetValue(path);

        if (provider == null)
        {
            httpContext.Response.StatusCode = (int)HttpStatusCode.NotFound;

            return new MessageDto($"Requested info page '{path}' wasn't found. Existing ones: {providers.Keys.Dump()}.");
        }

        var details = await provider.GetDiagnosticInfoAsync(httpContext.RequestAborted);

        return new InfoPageDetailsDto(
            provider.Metadata.Name,
            provider.Metadata.ShortDescription,
            provider.Metadata.DescriptionHtml?.Value,
            details.ToDiagnosticJson());
    }
}
