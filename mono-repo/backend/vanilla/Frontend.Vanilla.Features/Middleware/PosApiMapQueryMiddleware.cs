using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Features.TrackerId;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Frontend.Vanilla.ServiceClients.Services.Crm;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.Middleware;

internal sealed class PosApiMapQueryMiddleware(
    RequestDelegate next,
    IEndpointMetadata endpointMetadata,
    IPosApiCrmServiceInternal posApiCrmService,
    ITrackerIdConfiguration trackerIdConfig)
    : WebAbstractions.Middleware(next)
{
    public override Task InvokeAsync(HttpContext httpContext)
    {
        var request = httpContext.Request;

        if (!endpointMetadata.Contains<ServesHtmlDocumentAttribute>() || request.Query.Count == 0 || !trackerIdConfig.BtagCallEnabled)
            return Next(httpContext);

        return EvaluateRedirectAsync();

        async Task EvaluateRedirectAsync()
        {
            var queryString = request.Query.ToDictionary(StringComparer.OrdinalIgnoreCase);
            var mappedQuery = await posApiCrmService.MapQueryAsync(httpContext.RequestAborted, queryString, trackerIdConfig.UseOnlyWmId);

            if (!mappedQuery.Modified)
            {
                await Next(httpContext);

                return;
            }

            var targetBuilder = new UriBuilder { Path = request.Path, Query = QueryUtil.Build(mappedQuery.Query) };
            httpContext.Response.Redirect(targetBuilder.Uri.PathAndQuery, source: this);
        }
    }
}
