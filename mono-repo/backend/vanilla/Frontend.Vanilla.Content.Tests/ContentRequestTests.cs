using System;
using FluentAssertions;
using Frontend.Vanilla.Content.DataSources;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.Content.Tests;

public class ContentRequestTests
{
    private HttpUri itemUrl;
    private DocumentId id;
    private SitecoreLanguages langs;
    private EditorOverrides editorSettings;

    public ContentRequestTests()
    {
        itemUrl = new HttpUri("http://sitecore/content");
        id = new DocumentId("/id");
        langs = new SitecoreLanguages("x", "y", "z");
        editorSettings = new EditorOverrides();
    }

    [Theory, BooleanData]
    public void ShouldCreateCorrectly(bool useCache)
    {
        var target = new ContentRequest(itemUrl, id, langs, editorSettings, 666, useCache); // Act

        target.ItemUrl.Should().BeSameAs(itemUrl);
        target.Id.Should().BeSameAs(id);
        target.Languages.Should().BeSameAs(langs);
        target.EditorOverrides.Should().BeSameAs(editorSettings);
        target.PrefetchDepth.Should().Be(666);
        target.UseCache.Should().Be(useCache);
    }

    [Theory]
    [InlineData("http://sitecore/content?depth")]
    [InlineData("http://sitecore/content?depth=5")]
    [InlineData("http://sitecore/content?DEPTH=5")]
    [InlineData("http://sitecore/content?xml=1&depth=4&lang=en")]
    public void ShouldThrow_IfUrlContainsDepth(string urlStr)
    {
        itemUrl = new HttpUri(urlStr);

        Func<object> act = () => new ContentRequest(itemUrl, id, langs, editorSettings, 666, false); // Act

        act.Should().Throw<ArgumentException>()
            .Which.ParamName.Should().Be("itemUrl");
    }
}
