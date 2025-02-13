#nullable enable

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Frontend.Vanilla.Content.DataSources;
using Frontend.Vanilla.Content.Loading.XmlSources;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;

namespace Frontend.Vanilla.Content.Loading.Deserialization;

/// <summary>
/// Deserializes (loading, parsing, mapping) content items according to particular request.
/// </summary>
internal interface IDeserializationContentLoader
{
    Task<WithPrefetched<Content<IDocument>>> GetContentsAsync(ExecutionMode mode, ContentRequest request, Action<object>? trace);
}

internal sealed class DeserializationContentLoader(IContentXmlSource xmlSource, IContentXmlParser xmlParser, IDocumentDeserializer deserializer)
    : IDeserializationContentLoader
{
    public async Task<WithPrefetched<Content<IDocument>>> GetContentsAsync(ExecutionMode mode, ContentRequest request, Action<object>? trace)
    {
        var depthToLoad = (request.UseCache || request.BypassChildrenCache) ? request.PrefetchDepth : 0;
        var requestUrl = new UriBuilder(request.ItemUrl)
            .AddQueryParameters(("depth", (depthToLoad + 1).ToInvariantString())) // +1 to get child ids
            .GetHttpUri();

        var contentXml = await xmlSource.GetContentXmlAsync(mode, requestUrl, request.UseCache, trace);

        if (contentXml.Xml == null)
            return GetResult(new NotFoundContent<IDocument>(request.Id));

        var data = xmlParser.ParseData(contentXml.Xml, request.Id.Culture, request.Languages.ContentLanguage, depthToLoad, contentXml.SitecoreLoadTime);

        var requestedResult = DeserializeContent(data.Requested);
        var prefetchedResults = data.Prefetched.ConvertAll(DeserializeContent);

        return GetResult(requestedResult, prefetchedResults);

        WithPrefetched<Content<IDocument>> GetResult(Content<IDocument> content, IEnumerable<Content<IDocument>>? prefetched = null)
            => new WithPrefetched<Content<IDocument>>(content, prefetched, contentXml.RelativeExpiration);
    }

    private Content<IDocument> DeserializeContent(DocumentSourceData sourceData)
    {
        try
        {
            var document = deserializer.Deserialize(sourceData);

            return new SuccessContent<IDocument>(document);
        }
        catch (Exception ex)
        {
            return new InvalidContent<IDocument>(sourceData.Metadata.Id, sourceData.Metadata, ex.ToString());
        }
    }
}
