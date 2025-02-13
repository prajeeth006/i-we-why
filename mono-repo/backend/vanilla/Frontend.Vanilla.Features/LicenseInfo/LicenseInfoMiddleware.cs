using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.PlaceholderReplacers;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.LicenseInfo;

internal sealed class LicenseInfoMiddleware(
    RequestDelegate next,
    IEndpointMetadata endpointMetadata,
    ILicenseInfoServiceInternal licenceInfoService,
    IProductPlaceholderReplacer productPlaceholderReplacer)
    : WebAbstractions.Middleware(next)
{
    // Tries to avoid async ovearhead if possible b/c executed for each request
    public override Task InvokeAsync(HttpContext httpContext)
        => endpointMetadata.Contains<ServesHtmlDocumentAttribute>()
            ? EvaluateLicenseAsync(httpContext)
            : Next(httpContext);

    private async Task EvaluateLicenseAsync(HttpContext httpContext)
    {
        var licenceInfo = await licenceInfoService.GetLicenceComplianceAsync(ExecutionMode.Async(httpContext.RequestAborted));

        if (!licenceInfo.AcceptanceNeeded)
        {
            await Next(httpContext);

            return;
        }

        var redirectUrl = await productPlaceholderReplacer.ReplaceAsync(ExecutionMode.Async(httpContext.RequestAborted), licenceInfo.RedirectUrl);
        httpContext.Response.Headers.Append("X-LicenseInfo", licenceInfo.Licenses);
        httpContext.Response.Redirect(redirectUrl, source: this);
    }
}
