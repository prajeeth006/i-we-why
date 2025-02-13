using System;
using System.Collections.Generic;
using Frontend.Vanilla.Content.Model;

namespace Frontend.Vanilla.Content.Loading.ProxyFolder;

/// <summary>
/// Performs basic sanity related to proxy folders.
/// </summary>
internal sealed class ProxyFolderPreCachingContentProcessor : SyncPreCachingContentProcessor
{
    public override Content<IDocument> Process(SuccessContent<IDocument> content, ICollection<IJustInTimeContentProcessor> justInTimeProcessors, Action<object> trace)
    {
        if (!(content.Document is IProxyFolder proxy))
        {
            trace?.Invoke(TraceMessages.NotProxyFolder);

            return content;
        }

        if (proxy.Metadata.ChildIds.Count == 0)
        {
            trace?.Invoke(TraceMessages.NoChildren);

            return content.ToFiltered();
        }

        justInTimeProcessors.Clear(); // Process proxy folder standalone, matched target gets full processing on its own
        justInTimeProcessors.Add(new ProxyFolderJustInTimeContentProcessor());

        return content;
    }

    public static class TraceMessages
    {
        public const string NotProxyFolder = "No proxy folder processing because the content isn't a proxy folder.";
        public const string NoChildren = "Filtered out because the content is a proxy folder without children.";
    }
}
