using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.WebAbstractions;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.EntryWeb.Prerender;

/// <summary>
/// See <see cref="IRequestDslProvider.IsPrerendered" />.
/// </summary>
internal interface IPrerenderDetector
{
    bool IsRequestFromPrerenderService { get; }
}

internal sealed class PrerenderDetector(IHttpContextAccessor httpContextAccessor) : IPrerenderDetector
{
    public const string RequestFromPrerenderServiceHeader = "X-Prerender";

    public bool IsRequestFromPrerenderService
    {
        get
        {
            var httpContext = httpContextAccessor.GetRequiredHttpContext();

            return httpContext.Request.Headers.GetValue(RequestFromPrerenderServiceHeader) == "1";
        }
    }
}
