#nullable enable

using System;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using System.Xml.Linq;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Core.Time;

namespace Frontend.Vanilla.Content.Loading.XmlSources;

/// <summary>
/// Retrieves raw content XML directly from Sitecore service.
/// </summary>
internal sealed class SitecoreServiceContentXmlSource(IRestClient restClient, IContentConfiguration config, IClock clock) : IContentXmlSource
{
    public async Task<ContentXml> GetContentXmlAsync(ExecutionMode mode, HttpUri requestUrl, bool useCache, Action<object>? trace)
    {
        try
        {
            var request = new RestRequest(requestUrl) { Timeout = config.RequestTimeout };
            trace?.Invoke($"Making GET request to Sitecore URL '{requestUrl}' with timeout '{config.RequestTimeout}'.");

            var response = await restClient.ExecuteAsync(mode, request);
            var sitecoreLoadTime = clock.UtcNow;
            trace?.Invoke($"Received {response} response with following body.");
            trace?.Invoke(response.Content.DecodeToString());

            switch (response.StatusCode)
            {
                case var code when code.IsSucccess():
                    try
                    {
                        var xml = XElement.Load(new MemoryStream(response.Content));
                        var content = new ContentXml(xml, config.CacheTimes.Default, sitecoreLoadTime);

                        trace?.Invoke($"Content XML is valid, using default cache time '{config.CacheTimes.Default}'.");

                        return content;
                    }
                    catch (Exception ex)
                    {
                        throw new Exception("Invalid content XML: " + response.Content.DecodeToString(), ex);
                    }

                case HttpStatusCode.NotFound:
                    trace?.Invoke($"Content is not-found, using not-found cache time '{config.CacheTimes.NotFoundContent}'.");

                    return new ContentXml(xml: null, config.CacheTimes.NotFoundContent, sitecoreLoadTime);

                default:
                    throw new Exception(
                        $"Unexpected Sitecore response {(int)response.StatusCode} {response.StatusDescription} with body: {response.Content.DecodeToString()}");
            }
        }
        catch (Exception ex)
        {
            trace?.Invoke($"Failed Sitecore request or response processing: {ex}");

            throw new Exception(
                $"Failed loading content from Sitecore service at '{requestUrl}'. Check the connection, validity of the response and investigate on Sitecore side.", ex);
        }
    }
}
