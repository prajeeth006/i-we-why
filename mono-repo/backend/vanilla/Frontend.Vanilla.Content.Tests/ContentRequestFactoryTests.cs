using System;
using System.Collections.Generic;
using System.Globalization;
using FluentAssertions;
using Frontend.Vanilla.Content.DataSources;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Testing.FluentAssertions;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests;

public class ContentRequestFactoryTests
{
    private readonly ContentConfigurationBuilder config;
    private readonly Mock<ISitecoreLanguageResolver> langResolverMock;
    private readonly Mock<IEditorOverridesResolver> editorSettingsResolverMock;
    private readonly Mock<IDocumentIdFactory> documentIdFactoryMock;
    private readonly Mock<ISmartUrlReplacementResolver> smartUrlReplacementResolverMock;

    private DocumentId id;
    private readonly SitecoreLanguages langs;
    private EditorOverrides editorSettings;

    public ContentRequestFactoryTests()
    {
        config = new ContentConfigurationBuilder
        {
            Host = new Uri("http://sitecore/"),
            RootNodePath = "/root/node",
        };
        langResolverMock = new Mock<ISitecoreLanguageResolver>();
        editorSettingsResolverMock = new Mock<IEditorOverridesResolver>();
        documentIdFactoryMock = new Mock<IDocumentIdFactory>();
        smartUrlReplacementResolverMock = new Mock<ISmartUrlReplacementResolver>();

        id = new DocumentId("/path/item", culture: new CultureInfo("sw-KE"));
        langs = new SitecoreLanguages("xxx", "yyy", "zzz");
        editorSettings = new EditorOverrides();

        langResolverMock.Setup(r => r.ResolveLanguages(id.Culture)).Returns(() => langs);
        editorSettingsResolverMock.Setup(r => r.Resolve()).Returns(() => editorSettings);
    }

    [Fact]
    public void ShouldCreateRequest()
        => RunTestAndExpectUrl("http://sitecore/V5/root/node/path/item.aspx?xml=1&sc_lang=xxx&defaultLang=yyy&url_lang=zzz&env=prod&culture=sw-ke&sc_mode=normal");

    [Fact]
    public void ShouldSpecifyPreview_FromConfig()
    {
        config.ForcePreview = true;
        RunTestAndExpectPreviewUrl();
    }

    [Fact]
    public void ShouldSpecifyPreview_FromEditorSettings()
    {
        editorSettings = new EditorOverrides(usePreview: true);
        RunTestAndExpectPreviewUrl();
    }

    private void RunTestAndExpectPreviewUrl()
        => RunTestAndExpectUrl(
            "http://preview.sitecore/V5/root/node/path/item.aspx?xml=1&sc_lang=xxx&defaultLang=yyy&url_lang=zzz&sc_mode=preview&env=prod&culture=sw-ke");

    [Fact]
    public void ShouldSpecifyPreviewDate_FromEditorSettings()
    {
        editorSettings = new EditorOverrides(usePreview: true, previewDate: new UtcDateTime(2001, 2, 3, 14, 5, 6));
        RunTestAndExpectUrl(
            "http://preview.sitecore/V5/root/node/path/item.aspx?xml=1&sc_lang=xxx&defaultLang=yyy&url_lang=zzz&sc_mode=preview&env=prod&sc_date=20010203T140506Z&culture=sw-ke");
    }

    [Fact]
    public void ShouldNotToUseCache_IfSpecifiedInEditorSettings()
    {
        editorSettings = new EditorOverrides(noCache: true);
        RunTestAndExpectNotToUseCache();
    }

    [Fact]
    public void ShouldNotToUseCache_IfItemPathEnabled()
    {
        config.ItemPathDisplayModeEnabled = true;
        RunTestAndExpectNotToUseCache();
    }

    [Fact]
    public void ShouldNotToUseCache_IfDisabledInConfig()
    {
        config.CacheTimes.Default = TimeSpan.Zero;
        RunTestAndExpectNotToUseCache();
    }

    private void RunTestAndExpectNotToUseCache()
        => RunTestAndExpectUrl(
            "http://sitecore/V5/root/node/path/item.aspx?xml=1&sc_lang=xxx&defaultLang=yyy&url_lang=zzz&sc_nocache=true&env=prod&culture=sw-ke&sc_mode=normal",
            expectedUseCache: false);

    [Fact]
    public void ShouldSkipRootNodePath_IfAbsoluteRootSpecifiedInId()
    {
        id = new DocumentId(id.Path, DocumentPathRelativity.AbsoluteRoot, id.Culture);
        var normalizedId = new DocumentId("normalized");
        documentIdFactoryMock.Setup(f => f.Create(id.Path, id.Culture, null)).Returns(normalizedId);

        RunTestAndExpectUrl(
            "http://sitecore/V5/path/item.aspx?xml=1&sc_lang=xxx&defaultLang=yyy&url_lang=zzz&env=prod&culture=sw-ke&sc_mode=normal",
            expectedId: normalizedId);
    }

    [Fact]
    public void ShouldAddRevisionNumber_IfSpecified()
    {
        IContentRequestFactory target = new ContentRequestFactory(
            config.Build(),
            langResolverMock.Object,
            editorSettingsResolverMock.Object,
            documentIdFactoryMock.Object,
            smartUrlReplacementResolverMock.Object);
        var result = target.Create(id, 0, false, "test"); // Act

        result.ItemUrl.Should()
            .BeUriWithAnyQueryOrder(
                "http://sitecore/V5/root/node/path/item.aspx?xml=1&sc_lang=xxx&defaultLang=yyy&url_lang=zzz&env=prod&culture=sw-ke&sc_mode=normal&revision=test");
    }

    [Fact]
    public void ShouldAddSmartUrl_IfSpecified()
    {
        var smartUrls = new List<string> { "casino%7Chttps%3A%2F%2Fcasino.bwin.com%2F", "sports%7Chttps%3A%2F%2Fsports.bwin.com%2F" };

        IContentRequestFactory target = new ContentRequestFactory(
            config.Build(),
            langResolverMock.Object,
            editorSettingsResolverMock.Object,
            documentIdFactoryMock.Object,
            smartUrlReplacementResolverMock.Object);

        smartUrlReplacementResolverMock.Setup(x => x.Resolve()).Returns(smartUrls);

        var result = target.Create(id, 0, false, "test"); // Act

        result.ItemUrl.Should()
            .BeUriWithAnyQueryOrder(
                "http://sitecore/v5/root/node/path/item.aspx?xml=1&sc_lang=xxx&defaultLang=yyy&url_lang=zzz&sc_mode=normal&env=prod&culture=sw-ke&smartUrlOverride=casino%257Chttps%253A%252F%252Fcasino.bwin.com%252F&smartUrlOverride=sports%257Chttps%253A%252F%252Fsports.bwin.com%252F&revision=test");
    }

    private void RunTestAndExpectUrl(string expectedUrl, bool expectedUseCache = true, DocumentId expectedId = null)
    {
        IContentRequestFactory target = new ContentRequestFactory(
            config.Build(),
            langResolverMock.Object,
            editorSettingsResolverMock.Object,
            documentIdFactoryMock.Object,
            smartUrlReplacementResolverMock.Object);

        var result = target.Create(id); // Act

        langResolverMock.Verify(x => x.ResolveLanguages(It.IsAny<CultureInfo>()), Times.Once);
        editorSettingsResolverMock.Verify(x => x.Resolve(), Times.Once);
        smartUrlReplacementResolverMock.Verify(x => x.Resolve(), Times.Once);

        result.ItemUrl.Should().BeUriWithAnyQueryOrder(expectedUrl);
        result.Id.Should().BeSameAs(expectedId ?? id);
        result.Languages.Should().BeSameAs(langs);
        result.EditorOverrides.Should().BeSameAs(editorSettings);
        result.UseCache.Should().Be(expectedUseCache);
    }
}
