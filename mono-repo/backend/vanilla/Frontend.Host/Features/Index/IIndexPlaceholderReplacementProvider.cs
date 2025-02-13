using Microsoft.AspNetCore.Http;

namespace Frontend.Host.Features.Index;

internal interface IIndexPlaceholderReplacementProvider
{
    Task<(string, string)> GetPlaceholderWithReplacementAsync(HttpContext httpContext);
}
