using System.Globalization;
using FluentAssertions;
using Frontend.Host.Features.WebAppMetadata;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Host.Tests.Features.WebAppMetadata;

public class WebAppMetadataRendererTests
{
    private IWebAppMetadataRenderer webAppMetadataRenderer;
    private Mock<IContentService> contentService;
    private Mock<IInternalRequestEvaluator> internalRequestEvaluator;
    private TestLogger<WebAppMetadataRenderer> log;

    private Mock<IStaticFileTemplate> metaTags;
    private string content;

    public WebAppMetadataRendererTests()
    {
        CultureInfoHelper.SetCurrent(new CultureInfo("en-US"));
        contentService = new Mock<IContentService>();
        internalRequestEvaluator = new Mock<IInternalRequestEvaluator>();
        log = new TestLogger<WebAppMetadataRenderer>();
        webAppMetadataRenderer = new WebAppMetadataRenderer(contentService.Object, internalRequestEvaluator.Object, log);

        metaTags = new Mock<IStaticFileTemplate>();
        metaTags.Setup(i => i.Content).Returns(() => content);

        content = @"<link rel=""manifest"" href=""/site.webmanifest"">
<style>.lol { background-color: red; }</style>
<meta name=""theme-color"" content=""#000000"">";

        contentService.Setup(c => c.GetRequiredAsync<IStaticFileTemplate>("App-v1.0/WebAppMetadata/MetaTags", CancellationToken.None, It.IsAny<ContentLoadOptions>()))
            .ReturnsAsync(metaTags.Object);
    }

    [Fact]
    public async Task ShouldRenderMetaTags()
    {
        var html = await webAppMetadataRenderer.RenderAsync(CancellationToken.None);

        html.Should().Be(content);
    }

    [Fact]
    public async Task ShouldRenderInlineStylesWithDiagnosticsForInternalRequests()
    {
        internalRequestEvaluator.Setup(e => e.IsInternal()).Returns(true);

        var html = await webAppMetadataRenderer.RenderAsync(CancellationToken.None);

        html.Should().Be($"<!-- start:web-app-metadata -->{content}<!-- end:web-app-metadata -->");
    }

    [Fact]
    public async Task ShouldSanitizeHtmlToDisallowScriptsAndLeaveStyles()
    {
        var expectedContent = content;
        content += @"<script>console.log('Hack');</script>";

        var html = await webAppMetadataRenderer.RenderAsync(CancellationToken.None);

        html.Should().Be(expectedContent);
    }

    [Fact]
    public async Task ShouldLogWarningIfHtmlContainsErrors()
    {
        var expectedContent = content;
        content += "</div>";

        var html = await webAppMetadataRenderer.RenderAsync(CancellationToken.None);

        html.Should().Be(expectedContent);
        log.Logged.Single().Verify(LogLevel.Warning, ("errors", Environment.NewLine + " - Error TagNotOpened at line 3:43: Start tag <div> was not found."));
    }
}
