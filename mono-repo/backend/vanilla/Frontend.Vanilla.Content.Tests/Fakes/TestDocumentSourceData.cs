using System.Collections.Generic;
using Moq;

namespace Frontend.Vanilla.Content.Tests.Fakes;

internal static class TestDocumentSourceData
{
    public static DocumentSourceData Get(DocumentId id = null)
    {
        id = id ?? TestDocumentId.Get();

        return new DocumentSourceData(
            metadata: Mock.Of<IDocumentMetadata>(m => m.Id == id),
            fields: new Dictionary<string, string>());
    }
}
