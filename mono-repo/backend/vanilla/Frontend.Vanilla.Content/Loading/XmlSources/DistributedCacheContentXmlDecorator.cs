#nullable enable

using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Xml.Linq;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Caching;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Core.Time;
using Frontend.Vanilla.Core.Xml;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Content.Loading.XmlSources;

/// <summary>
/// Decorates <see cref="IContentXmlSource" />. Stores content XML in <see cref="IDistributedCache" />.
/// Therefore, it offloads traffic to Sitecore service and in case of its outage it acts as a fallback even if cached content is stale.
/// </summary>
internal sealed class DistributedCacheContentXmlDecorator(
    IContentXmlSource inner,
    IDistributedCache cache,
    IContentConfiguration config,
    IClock clock,
    ILogger<DistributedCacheContentXmlDecorator> log)
    : IContentXmlSource
{
    public const string AbsoluteExpirationAttribute = "absoluteExpiration";
    public const string SitecoreLoadTimeAttribute = "sitecoreLoadTime";
    private static readonly DistributedCacheEntryOptions SetOptions = new DistributedCacheEntryOptions().SetAbsoluteExpiration(TimeSpan.FromHours(12));

    // No need for locking b/c it's done in upper layers - CachingLoaderDecorator
    public async Task<ContentXml> GetContentXmlAsync(ExecutionMode mode, HttpUri requestUrl, bool useCache, Action<object>? trace)
    {
        if (!useCache)
            return await inner.GetContentXmlAsync(mode, requestUrl, useCache, trace);

        var cachedResult = await GetFromDistributedCacheAsync(mode, requestUrl);

        if (cachedResult != null && cachedResult.RelativeExpiration > TimeSpan.Zero)
            return cachedResult;

        try
        {
            var freshResult = await inner.GetContentXmlAsync(mode, requestUrl, useCache: true, trace);
            if (freshResult.RelativeExpiration > TimeSpan.Zero)
                await SetToDistributedCacheAsync(mode, requestUrl, freshResult);

            return freshResult;
        }
        catch (Exception ex)
        {
            if (cachedResult == null)
                throw new Exception(
                    $"Failed retrieving content from Sitecore at '{requestUrl}'. Even there isn't any stale content in Hekaton cache or its loading failed.", ex);

            log.LogError(ex, "Failed retrieving content from Sitecore at {requestUrl}. Instead using stale content from distributed cache", requestUrl);

            return new ContentXml(cachedResult.Xml, config.CacheTimes.SitecoreOutage, cachedResult.SitecoreLoadTime);
        }
    }

    private async Task<ContentXml?> GetFromDistributedCacheAsync(ExecutionMode mode, HttpUri requestUrl)
    {
        byte[]? bytes = null;

        try
        {
            bytes = await cache.GetAsync(mode, GetCacheKey(requestUrl));

            if (bytes == null)
                return null;

            var hekatonXml = XElement.Load(new MemoryStream(bytes));
            var absExpiration = UtcDateTime.Parse(hekatonXml.AttributeValue(AbsoluteExpirationAttribute));
            var relExpiration = absExpiration - clock.UtcNow;
            var sitecoreXml = hekatonXml.Elements(ContentXml.ItemElement).Any() ? hekatonXml : null;
            var sitecoreLoadTimeStr = hekatonXml.AttributeValue(SitecoreLoadTimeAttribute); // Attribute didn't exist in older Vanilla
            var sitecoreLoadTime = !sitecoreLoadTimeStr.IsNullOrWhiteSpace() ? UtcDateTime.Parse(sitecoreLoadTimeStr) : default;

            return new ContentXml(sitecoreXml, relExpiration, sitecoreLoadTime);
        }
        catch (Exception ex)
        {
            var rawData = bytes?.DecodeToString();
            log.LogError(ex, "Failed loading content {requestUrl} from Hekaton cache. {rawData}", requestUrl, rawData);

            return null;
        }
    }

    private async Task SetToDistributedCacheAsync(ExecutionMode mode, HttpUri requestUrl, ContentXml result)
    {
        byte[]? bytes = null;

        try
        {
            var absExpiration = clock.UtcNow + result.RelativeExpiration;
            var hekatonXml = result.Xml ?? new XElement(ContentXml.RootElement);
            hekatonXml.SetAttributeValue(AbsoluteExpirationAttribute, absExpiration.ToString());
            hekatonXml.SetAttributeValue(SitecoreLoadTimeAttribute, result.SitecoreLoadTime.ToString());
            bytes = hekatonXml.ToBytes();

            await cache.SetAsync(mode, GetCacheKey(requestUrl), bytes, SetOptions);
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Failed saving content {requestUrl} to Hekaton cache. {rawData}", requestUrl, bytes?.DecodeToString());
        }
    }

    private static string GetCacheKey(HttpUri requestUrl)
        => requestUrl.ToString();
}
