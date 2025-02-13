using System;
using System.Threading.Tasks;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.DomainSpecificActions.Configuration;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.DomainSpecificActions;

internal sealed class DomainSpecificActionsMiddleware(
    RequestDelegate next,
    IEndpointMetadata endpointMetadata,
    IDsaConfiguration config,
    IBrowserUrlProvider browserUrlProvider)
    : WebAbstractions.Middleware(next)
{
    public override Task InvokeAsync(HttpContext httpContext)
        => endpointMetadata.Contains<ServesHtmlDocumentAttribute>() && config.HtmlDocumentServerDslAction != null
            ? ExecuteDsaAsync(httpContext, config.HtmlDocumentServerDslAction)
            : Next(httpContext);

    private async Task ExecuteDsaAsync(HttpContext httpContext, IDslAction dslAction)
    {
        try
        {
            await dslAction.ExecuteAsync(httpContext.RequestAborted);
        }
        catch (Exception ex)
        {
            throw new Exception($"Failed executing configured server-side DSL action: {config.HtmlDocumentServerDslAction}.", ex);
        }

        var redirect = browserUrlProvider.PendingRedirect;

        if (redirect != null)
        {
            httpContext.Response.Redirect(redirect.Url.AbsoluteUri, source: DsaConfiguration.FeatureName, redirect.Permanent);

            return;
        }

        await Next(httpContext);
    }
}
