using System.Globalization;
using FluentAssertions;
using Frontend.Host.Features.SiteRootFiles;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Features.WebIntegration.Configuration.DynaCon;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Host.Tests.Features.SiteRootFiles;

public sealed class SiteRootFileResolverTests
{
    private ISiteRootFileResolver target;
    private Mock<IContentService> contentService;
    private TestLogger<SiteRootFileResolver> log;

    private CancellationToken ct;
    private Content<IDocument> productContent;
    private Content<IDocument> sharedContent;

    public SiteRootFileResolverTests()
    {
        CultureInfoHelper.SetCurrent(new CultureInfo("sw-KE"));
        contentService = new Mock<IContentService>();
        var dynaConParams = new Mock<IDynaConParameterExtractor>();
        log = new TestLogger<SiteRootFileResolver>();
        target = new SiteRootFileResolver(contentService.Object, dynaConParams.Object, log);

        ct = TestCancellationToken.Get();
        productContent = TestContent.Get<IDocument>(DocumentStatus.NotFound);
        sharedContent = TestContent.Get<IDocument>(DocumentStatus.NotFound);

        dynaConParams.SetupGet(e => e.Product).Returns("Sports");
        contentService.Setup(s => s.GetContentAsync<IDocument>("App-v1.0/SiteRootFiles/Sports/dir/file.lol", ct, default)).ReturnsAsync(() => productContent);
        contentService.Setup(s => s.GetContentAsync<IDocument>("App-v1.0/SiteRootFiles/dir/file.lol", ct, default)).ReturnsAsync(() => sharedContent);
    }

    private Task<SiteRootFileResult> Act(string path = "/dir/file.lol")
        => target.ResolveAsync(path, ct)!;

    private Content<IDocument> GetSuccessContent(string? mimeType = "spam/cash", int cacheTime = 66)
        => TestContent.Get<IDocument>(document: Mock.Of<IStaticFileTemplate>(
            f => f.Content == "Test content" && f.MimeType == mimeType && f.ClientCacheTime == cacheTime));

    [Fact]
    public async Task ShouldLoadProductSpecificFileByDefault()
    {
        productContent = GetSuccessContent();
        await RunFileTest(expectedContentRequestCount: 1);
    }

    [Fact]
    public async Task ShoudlFallbackToSharedRootFolder_IfNoProductContentFound()
    {
        sharedContent = GetSuccessContent();
        await RunFileTest(expectedContentRequestCount: 2);
    }

    private async Task RunFileTest(int expectedContentRequestCount)
    {
        var result = await Act();

        result.Content.Should().Be("Test content");
        result.ContentType.Should().Be("spam/cash");
        result.CacheTime.Should().Be(TimeSpan.FromMinutes(66));

        contentService.Invocations.Should().HaveCount(expectedContentRequestCount);
        log.VerifyNothingLogged();
    }

    [Theory]
    [InlineData(DocumentStatus.Success, DocumentStatus.Success)]
    [InlineData(DocumentStatus.Success, DocumentStatus.Filtered)]
    [InlineData(DocumentStatus.Filtered, DocumentStatus.Success)]
    [InlineData(DocumentStatus.Filtered, DocumentStatus.Filtered)]
    [InlineData(DocumentStatus.NotFound, DocumentStatus.Success)]
    [InlineData(DocumentStatus.NotFound, DocumentStatus.Filtered)]
    public async Task ShouldReturnNull_IfNotFoundOrFilteredOrOTherType(DocumentStatus productContentStatus, DocumentStatus sharedContentStatus)
    {
        productContent = TestContent.Get<IDocument>(productContentStatus, document: Mock.Of<IFolder>());
        sharedContent = TestContent.Get<IDocument>(sharedContentStatus, document: Mock.Of<IFolder>());

        var result = await Act();

        result.Should().BeNull();
        contentService.Invocations.Should().HaveCount(2);

        var logged = log.Logged.Single();
        logged.Level.Should().Be(LogLevel.Warning);
        logged.Data["urlPath"].Should().Be("/dir/file.lol");
        ((string)logged.Data["underlyingContent"]!).Should().ContainAll(
            productContent.Id,
            productContentStatus,
            sharedContent.Id,
            sharedContentStatus);
    }

    [Theory, ValuesData("application/json", "text/css")]
    public async Task ContentType_ShouldFallbackToConfig(string? mimeType)
    {
        productContent = GetSuccessContent(mimeType);

        var result = await Act();

        result.ContentType.Should().Be(mimeType);
    }

    [Theory]
    [InlineData("/file.wtf")]
    [InlineData("/without-extension")]
    public async Task ContentType_ShouldFallbackToPlainText_IfNotInConfigOrNoExtension(string path)
    {
        contentService.Setup(s => s.GetContentAsync<IDocument>("App-v1.0/SiteRootFiles/Sports" + path, ct, default))
            .ReturnsAsync(GetSuccessContent(mimeType: null!));

        var result = await Act(path);

        result.ContentType.Should().Be(ContentTypes.Text);
    }

    [Theory, ValuesData(-66, 0)]
    public async Task CacheTime_ShouldSetArbitrary_IfNotProvided(int cacheTime)
    {
        productContent = GetSuccessContent(cacheTime: cacheTime);

        var result = await Act();

        result.CacheTime.Should().Be(TimeSpan.FromHours(4));
    }

    [Theory, ValuesData("", "/")]
    public async Task ShouldReturnNull_IfEmptyPath(string path)
    {
        var result = await Act(path);

        result.Should().BeNull();
        contentService.VerifyWithAnyArgs(s => s.GetContent<IDocument>(null!, default), Times.Never());
        log.VerifyNothingLogged();
    }

    [Fact]
    public async Task ShouldThrow_IfInvalidContent()
    {
        productContent = TestContent.Get<IDocument>(DocumentStatus.Invalid, error: "Oups");

        Func<Task> act = () => Act();

        var ex = (await act.Should().ThrowAsync<Exception>()).Which;
        ex.Message.Should().Contain("'/dir/file.lol'");
        ex.InnerException!.Message.Should().ContainAll(productContent.Id, "Oups");
    }
}
