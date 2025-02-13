using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.EntryWeb.Prerender;
using Frontend.Vanilla.Features.Routing;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.DslProviders;

/// <summary>
/// Implementation of <see cref="IRequestDslProvider" />.
/// </summary>
internal sealed class RequestDslProvider(
    IBrowserUrlProvider browserUrlProvider,
    IInternalRequestEvaluator requestEvaluator,
    IPrerenderDetector prerenderDetector,
    IClientIPResolver clientIpResolver,
    IRequestDslRedirector requestDslRedirector,
    IHttpContextAccessor httpContextAccessor)
    : IRequestDslProvider
{
    public string AbsoluteUri
        => browserUrlProvider.Url.AbsoluteUri;

    public string AbsolutePath
        => browserUrlProvider.Url.AbsolutePath;

    public string PathAndQuery
        => browserUrlProvider.Url.PathAndQuery;

    public string Query
        => browserUrlProvider.Url.Query;

    public string Host
        => browserUrlProvider.Url.Host;

    public string? CultureToken
        => httpContextAccessor.GetRequiredHttpContext().Request.RouteValues.GetString(RouteValueKeys.Culture, "route value");

    public bool IsInternal
        => requestEvaluator.IsInternal();

    public string ClientIP
        => clientIpResolver.Resolve().ToString();

    public bool IsPrerendered
        => prerenderDetector.IsRequestFromPrerenderService;

    public void Redirect(string url)
        => requestDslRedirector.Redirect(url, permanentRedirect: false, preserveQuery: false);

    public void Redirect(string url, bool permanentRedirect, bool preserveQuery)
        => requestDslRedirector.Redirect(url, permanentRedirect, preserveQuery);
}
