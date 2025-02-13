using System;
using System.Globalization;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.ContentServiceImpl;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Content.Tests.Fakes;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests;

public class SitecoreLinkUrlProviderTests
{
    private ISitecoreLinkUrlProvider target;
    private Mock<IGetDocumentCommand> getDocumentCommand;
    private ExecutionMode mode;

    public SitecoreLinkUrlProviderTests()
    {
        CultureInfoHelper.SetCurrent(new CultureInfo("sw-KE"));
        getDocumentCommand = new Mock<IGetDocumentCommand>();
        target = new SitecoreLinkUrlProvider(getDocumentCommand.Object);
        mode = TestExecutionMode.Get();
    }

    [Theory]
    [InlineData("http://www.bwin.com")]
    [InlineData("/relative-url")]
    public async Task ShouldRetrieveUrlFromLinkProperty(string url)
    {
        SetupContent(TestContentLink.Get(url));
        await RunAndExpectUrl(url);
    }

    [Fact]
    public async Task ShouldRetrieveUrlFromUrlProperty()
    {
        SetupContent(url: new Uri("http://www.bwin.com"));
        await RunAndExpectUrl("http://www.bwin.com");
    }

    [Fact]
    public async Task ShouldPreferLinkPropertyOverUrl()
    {
        SetupContent(TestContentLink.Get("http://content-link"), url: new Uri("http://url-link"));
        await RunAndExpectUrl("http://content-link");
    }

    [Fact]
    public void ShouldThrow_IfNoUrl()
    {
        SetupContent();
        RunAndExpectError($"There is no useful value in {nameof(ILinkTemplate.Url)} and {nameof(ILinkTemplate.Link)} fields.");
    }

    [Fact]
    public void ShouldThrow_IfUrlNotRooted()
    {
        SetupContent(url: new Uri("relative-not-based", UriKind.Relative));
        RunAndExpectError("URL from the link must be absolute or root-relative (starts with '/') to be usable for redirects but it is 'relative-not-based'.");
    }

    [Fact]
    public void ShouldThrow_IfMissingContent()
    {
        getDocumentCommand.SetupWithAnyArgs(s => s.GetRequiredAsync<ILinkTemplate>(default, null, default)).Throws(new Exception("Content error."));
        RunAndExpectError("Content error.");
    }

    private void SetupContent(ContentLink link = null, Uri url = null)
        => getDocumentCommand.Setup(s => s.GetRequiredAsync<ILinkTemplate>(mode, "App-v1.0/path", default))
            .ReturnsAsync(Mock.Of<ILinkTemplate>(t => t.Link == link && t.Url == url));

    private async Task RunAndExpectUrl(string expectedUrl)
    {
        var result = await target.GetUrlAsync(mode, "App-v1.0/path"); // Act

        result.Should().Be(new Uri(expectedUrl, UriKind.RelativeOrAbsolute));
    }

    private void RunAndExpectError(string innerMessage)
    {
        Func<Task> act = () => target.GetUrlAsync(mode, "App-v1.0/path"); // Act

        act.Should().ThrowAsync<Exception>().WithMessage("Unable to get URL from content link /app-v1.0/path - sw-KE.").Result
            .Which.InnerException.Message.Contains(innerMessage);
    }
}
