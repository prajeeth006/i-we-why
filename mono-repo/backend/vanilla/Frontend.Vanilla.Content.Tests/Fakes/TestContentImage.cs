using System;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.Content.Tests.Fakes;

public static class TestContentImage
{
    public static ContentImage Get()
        => new ContentImage(
            src: $"http://media/{Guid.NewGuid()}.jpg",
            alt: $"Alt-{Guid.NewGuid()}",
            width: RandomGenerator.GetInt32(),
            height: RandomGenerator.GetInt32());
}
