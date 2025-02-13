using System;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Testing.Fakes;

namespace Frontend.Vanilla.Content.Tests.Fakes;

internal static class TestDocumentId
{
    public static DocumentId Get()
    {
        var path = Guid.NewGuid().ToString();
        var relativity = RandomGenerator.Get<DocumentPathRelativity>();
        var culture = TestCulture.GetRandom();

        return new DocumentId(path, relativity, culture);
    }
}
