using System;
using System.Collections;
using System.Collections.Generic;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Loading;
using Frontend.Vanilla.Content.Loading.Caching;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.System;
using Moq;

namespace Frontend.Vanilla.Testing.Fakes;

internal class NotSuccessStatuses : IEnumerable<object[]>
{
    public IEnumerator<object[]> GetEnumerator()
    {
        yield return new object[] { DocumentStatus.Filtered };
        yield return new object[] { DocumentStatus.Invalid };
        yield return new object[] { DocumentStatus.NotFound };
    }

    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}

internal static class TestContent
{
    public static SuccessContent<IDocument> GetSuccess()
        => (SuccessContent<IDocument>)Get<IDocument>();

    public static Content<T> Get<T>(
        DocumentStatus status = DocumentStatus.Success,
        DocumentId id = null,
        IDocumentMetadata metadata = null,
        T document = null,
        string error = null)
        where T : class, IDocument
    {
        id = id ?? metadata?.Id ?? "/test";
        metadata = metadata ?? Mock.Of<IDocumentMetadata>(m => m.Id == id);
        document = document ?? Mock.Of<T>();

        if (document.Metadata == null)
            Mock.Get(document).SetupGet(d => d.Metadata).Returns(metadata);
        if (document.Data == null)
            Mock.Get(document).SetupGet(d => d.Data).Returns(new DocumentData(metadata, new Dictionary<string, object> { { "Foo", "Foo Value" } }));

        return status switch
        {
            DocumentStatus.Success => new SuccessContent<T>(document),
            DocumentStatus.Invalid => new InvalidContent<T>(id, metadata, error ?? "Test error."),
            DocumentStatus.NotFound => new NotFoundContent<T>(id),
            DocumentStatus.Filtered => new FilteredContent<T>(metadata),
            _ => throw status.GetInvalidException(),
        };
    }

    public static CachedContent GetCached(DocumentStatus status = DocumentStatus.Success, DocumentId id = null, IDocumentMetadata metadata = null)
        => new (Get<IDocument>(status, id, metadata, Mock.Of<IPCText>()), Array.Empty<IJustInTimeContentProcessor>());
}
