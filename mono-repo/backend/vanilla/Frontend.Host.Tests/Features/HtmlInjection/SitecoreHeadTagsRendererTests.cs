using FluentAssertions;
using Frontend.Host.Features.HtmlInjection;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Features;
using Frontend.Vanilla.Features.HtmlInjection;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Host.Tests.Features.HtmlInjection;

public class SitecoreHeadTagsRendererTests
{
    private readonly Mock<IContentService> contentService;
    private readonly TestLogger<SitecoreHeadTagsRenderer> log;
    private readonly HtmlInjectionConfiguration htmlInjectionConfiguration;
    private readonly Mock<IInternalRequestEvaluator> internalRequestEvaluator;
    private readonly Mock<IHtmlInjectionControlOverride> htmlInjectionControlOverride;
    private readonly SitecoreHeadTagsRenderer renderer;
    private static readonly DocumentId TestFolderId = new ("/content-v1.0/path", id: "test");

    public SitecoreHeadTagsRendererTests()
    {
        contentService = new Mock<IContentService>();
        log = new TestLogger<SitecoreHeadTagsRenderer>();
        htmlInjectionConfiguration = new HtmlInjectionConfiguration
        {
            EnableHtmlHeadTagsFromSitecore = true,
        };

        htmlInjectionControlOverride = new Mock<IHtmlInjectionControlOverride>();
        internalRequestEvaluator = new Mock<IInternalRequestEvaluator>();

        contentService.Setup(s => s.GetChildrenAsync<IStaticFileTemplate>(AppPlugin.ContentRoot + "/HtmlHeadTags", CancellationToken.None, default)).ReturnsAsync(
            new[]
            {
                Mock.Of<IStaticFileTemplate>(i => i.Content == "<meta content='Hello' />" && i.Metadata.Id == TestFolderId),
                Mock.Of<IStaticFileTemplate>(), // Empty
                Mock.Of<IStaticFileTemplate>(i => i.Content == "<meta content='BWIN' />" && i.Metadata.Id == TestFolderId),
            });
        renderer = new SitecoreHeadTagsRenderer(
            contentService.Object,
            internalRequestEvaluator.Object,
            htmlInjectionConfiguration,
            htmlInjectionControlOverride.Object,
            log);
    }

    [Theory]
    [InlineData(true, false, true)]
    [InlineData(false, false, false)]
    [InlineData(true, true, false)]
    [InlineData(false, true, false)]
    public async Task RenderHtmlHeadTagsFromSitecore_ShouldNotRenderTagsWhenDisabled(bool isEnabled, bool isDisabledByOverride, bool expected)
    {
        htmlInjectionConfiguration.EnableHtmlHeadTagsFromSitecore = isEnabled;
        htmlInjectionControlOverride.Setup(h => h.IsDisabled(HtmlInjectionKind.SitecoreHtmlHeadTags)).Returns(isDisabledByOverride);
        var result = await renderer.RenderAsync(CancellationToken.None);

        if (expected)
        {
            result.Should().NotBeNullOrEmpty();
        }
        else
        {
            result.Should().Be("");
        }
    }

    [Fact]
    public async Task RenderHtmlHeadTagsFromSitecore_ShallHandleExceptions()
    {
        var ex = new Exception();
        contentService.Setup(s => s.GetChildrenAsync<IStaticFileTemplate>(AppPlugin.ContentRoot + "/HtmlHeadTags", CancellationToken.None, default)).Throws(ex);

        var result = await renderer.RenderAsync(CancellationToken.None); // Act

        result.Should().Be(string.Empty);
        log.Logged.Single().Verify(LogLevel.Error, ex);
    }
}
