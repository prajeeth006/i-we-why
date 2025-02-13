using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Diagnostics.Contracts;
using Frontend.Vanilla.Diagnostics.Contracts.HttpRequest;
using Frontend.Vanilla.Features.WebAbstractions;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.HttpTester;

internal sealed class HttpTesterDiagnosticController(IRestClient restClient) : IDiagnosticApiController
{
    public DiagnosticsRoute GetRoute() => DiagnosticApiUrls.HttpTester.Url;

    public async Task<object?> ExecuteAsync(HttpContext httpContext)
    {
        var url = httpContext.Request.Query.GetRequired(DiagnosticApiUrls.HttpTester.UrlParameter);
        var headers = httpContext.Request.Query[DiagnosticApiUrls.HttpTester.HeadersParameter].ToString();

        try
        {
            var request = Convert(url, headers);
            var response = await restClient.ExecuteAsync(request, httpContext.RequestAborted);
            var h = response.Headers.ToDictionary(o => o.Key, v => v.Value.ToString());
            var model = new HttpTesterResult(
                request.Url.AbsoluteUri,
                Encoding.UTF8.GetString(response.Content),
                response.ExecutionDuration,
                h,
                response.StatusCode,
                response.StatusDescription);

            return model;
        }
        catch (Exception ex)
        {
            return new HttpTesterResult(url, ex.Message, default, new Dictionary<string, string>(), HttpStatusCode.BadRequest, HttpStatusCode.BadRequest.ToString());
        }
    }

    private RestRequest Convert(string url, string headers)
    {
        var restRequest = new RestRequest(new HttpUri(url));

        if (string.IsNullOrEmpty(headers)) return restRequest;

        foreach (var headerPair in headers.Split(','))
        {
            var a = headerPair.Split('=');
            restRequest.Headers.Add(a[0], a[1]);
        }

        return restRequest;
    }
}
