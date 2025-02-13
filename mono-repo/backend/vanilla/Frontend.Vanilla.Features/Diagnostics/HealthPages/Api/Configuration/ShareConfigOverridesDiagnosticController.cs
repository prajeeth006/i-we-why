using System;
using System.Net;
using Frontend.Vanilla.Configuration.DynaCon.LocalOverrides;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Diagnostics.Contracts;
using Frontend.Vanilla.Features.App;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.Configuration;

internal sealed class ShareConfigOverridesDiagnosticController(IConfigurationOverridesService overridesService, IAppConfiguration appConfig) : SyncDiagnosticApiController
{
    public override DiagnosticsRoute GetRoute() => DiagnosticApiUrls.Configuration.SharedOverrides.ShareUrl;

    public override object? Execute(HttpContext httpContext)
    {
        var overridesJson = overridesService.GetJson();

        if (!overridesJson.HasValues)
        {
            httpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;

            return new MessageDto("There are no overrides to be shared!");
        }

        var jsonStr = JsonConvert.SerializeObject(overridesJson);
        var scheme = appConfig.UsesHttps ? Uri.UriSchemeHttps : Uri.UriSchemeHttp;
        var host = httpContext.Request.Host;
        var port = host.Port != null && host.Port != 80 && host.Port != 443 ? host.Port.Value : -1;
        var url = new UriBuilder(scheme, host.Host, port)
            .AppendPathSegment(DiagnosticApiUrls.Configuration.SharedOverrides.ReceiveUrl)
            .AddQueryParameters((DiagnosticApiUrls.Configuration.SharedOverrides.OverridesParameter, jsonStr))
            .Uri;

        return new { Url = url.ToString() };
    }
}
