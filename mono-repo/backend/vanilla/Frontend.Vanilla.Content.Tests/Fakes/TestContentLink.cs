using System;
using System.Collections.Generic;
using Frontend.Vanilla.Content.Model;

namespace Frontend.Vanilla.Content.Tests.Fakes;

public static class TestContentLink
{
    public static ContentLink Get(string url = null)
        => new ContentLink(
            url: new Uri(url ?? $"http://bwin.com/xx/{Guid.NewGuid()}", UriKind.RelativeOrAbsolute),
            linkText: $"Text-{Guid.NewGuid()}",
            attributes: new Dictionary<string, string> { { "class", $"class-{Guid.NewGuid()}" } }.AsContentParameters());
}
