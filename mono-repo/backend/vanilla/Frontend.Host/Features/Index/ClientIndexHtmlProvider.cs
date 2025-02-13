using System.Text;
using Frontend.Host.Features.ClientApp;
using Frontend.Vanilla.Core.Caching.Isolation;
using Frontend.Vanilla.Features.WebAbstractions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;

namespace Frontend.Host.Features.Index;

internal interface IClientIndexHtmlProvider
{
    Task<string> GetAsync(HttpContext httpContext);
}

internal sealed class ClientIndexHtmlProvider : IClientIndexHtmlProvider
{
    private readonly IMemoryCache cache;
    private readonly IEnumerable<IIndexPlaceholderReplacementProvider> indexPlaceholderReplacers;
    private readonly SameSiteHttpClient sameSiteHttpClient;
    private const string IndexHtmlPath = "ClientDist/index.html";
    private const string IndexHtmlContentCacheKey = "index.html";

    public ClientIndexHtmlProvider(ILabelIsolatedMemoryCache cache, IEnumerable<IIndexPlaceholderReplacementProvider> indexPlaceholderReplacers, SameSiteHttpClient sameSiteHttpClient)
    {
        this.cache = cache;
        this.indexPlaceholderReplacers = indexPlaceholderReplacers;
        this.sameSiteHttpClient = sameSiteHttpClient;
    }
    public async Task<string> GetAsync(HttpContext httpContext)
    {
        var cachedIndexHtmlContent = await cache.GetOrCreateAsync(IndexHtmlContentCacheKey, async cacheEntry =>
        {
            cacheEntry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10); // todo
            var fullUrl = new Uri(httpContext.Request.GetAppBaseUrl(), IndexHtmlPath);
            var response = await sameSiteHttpClient.GetStringAsync(fullUrl, httpContext.RequestAborted);

            return response;
        });

        var sb = new StringBuilder(cachedIndexHtmlContent);
        var placeholdersWithValues = await Task.WhenAll(indexPlaceholderReplacers.Select(p => p.GetPlaceholderWithReplacementAsync(httpContext)));
        foreach (var placeholderWithValue in placeholdersWithValues)
        {
            sb.Replace(placeholderWithValue.Item1, placeholderWithValue.Item2);
        }
        return sb.ToString();
    }
}
