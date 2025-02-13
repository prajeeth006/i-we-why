using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.WebAbstractions;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.DslProviders;

/// <summary>
/// Implementation of <see cref="IRequestHeadersDslProvider" /> for ASP.NET 4 apps.
/// </summary>
internal sealed class RequestHeadersDslProvider(IHttpContextAccessor httpContextAccessor) : IRequestHeadersDslProvider
{
    public string UserAgent => Get(HttpHeaders.UserAgent);

    public string Get(string name)
    {
        var httpContext = httpContextAccessor.GetRequiredHttpContext();

        return httpContext.Request.Headers.GetValue(name).ToString();
    }
}
