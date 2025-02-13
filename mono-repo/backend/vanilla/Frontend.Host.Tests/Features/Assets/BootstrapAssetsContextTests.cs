using System.Net;
using System.Text;
using FluentAssertions;
using Frontend.Host.Features.Assets;
using Frontend.Host.Features.ClientApp;
using Frontend.Host.Features.Index;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.Features.Theming;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Newtonsoft.Json;
using Xunit;

namespace Frontend.Host.Tests.Features.Assets;

public class BootstrapAssetsContextTests
{
    private IBootstrapAssetsContext bootstrapAssetsContext;
    private Mock<IHttpClientFactory> httpClientFactory;
    private Mock<IWebpackManifestFileResolver> webpackManifestFileResolver;
    private Mock<IClientAppService> clientAppService;
    private Mock<IIndexHtmlConfiguration> indexHtmlConfiguration;
    private Mock<ILanguageService> languageService;
    private Mock<IThemeResolver> themeResolver;
    private CancellationToken cancellationToken = CancellationToken.None;

    public BootstrapAssetsContextTests()
    {
        httpClientFactory = new Mock<IHttpClientFactory>();
        webpackManifestFileResolver = new Mock<IWebpackManifestFileResolver>();
        clientAppService = new Mock<IClientAppService>();
        indexHtmlConfiguration = new Mock<IIndexHtmlConfiguration>();
        languageService = new Mock<ILanguageService>();
        themeResolver = new Mock<IThemeResolver>();

        webpackManifestFileResolver.Setup(w => w.GetFileNameAsync("ClientDist/manifest.json", "file.js", cancellationToken)).ReturnsAsync("resolved");
        webpackManifestFileResolver.Setup(w => w.GetFileNameAsync("ClientDist/changed-manifest.json", "file.js", cancellationToken)).ReturnsAsync("c-resolved");
        webpackManifestFileResolver.Setup(w => w.GetFileContentAsync("ClientDist/manifest.json", "file.js", cancellationToken)).ReturnsAsync("fcontent");
        clientAppService.SetupGet(c => c.Mode).Returns(ClientAppMode.DevServer);

        bootstrapAssetsContext =
            new BootstrapAssetsContext(webpackManifestFileResolver.Object, languageService.Object, themeResolver.Object, clientAppService.Object, indexHtmlConfiguration.Object);
    }

    private void SetupClient(Dictionary<string, string> data)
    {
        var httpMessageHandler = new FakeHttpMessageHandler(new HttpResponseMessage
        {
            StatusCode = HttpStatusCode.OK,
            Content = new StringContent(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json"),
        });
        var httpClient = new HttpClient(httpMessageHandler);
        httpClientFactory.Setup(h => h.CreateClient(It.IsAny<string>())).Returns(httpClient);
    }

    [Fact]
    public async Task WebpackFile_ShouldResolveWebpackFile()
    {
        clientAppService.SetupGet(c => c.Mode).Returns(ClientAppMode.FileSystem);
        bootstrapAssetsContext =
            new BootstrapAssetsContext(webpackManifestFileResolver.Object, languageService.Object, themeResolver.Object, clientAppService.Object, indexHtmlConfiguration.Object);
        (await bootstrapAssetsContext.WebpackFileAsync("file.js", cancellationToken)).Should().Be("resolved");
    }

    [Fact]
    public async Task WebpackFile_ReturnLocalWebpackFileIfDevServerIsUsed()
    {
        bootstrapAssetsContext =
            new BootstrapAssetsContext(webpackManifestFileResolver.Object, languageService.Object, themeResolver.Object, clientAppService.Object, indexHtmlConfiguration.Object);

        (await bootstrapAssetsContext.WebpackFileAsync("file.js", cancellationToken)).Should().Be("resolved");
    }

    [Fact]
    public async Task WebpackFile_ShouldResolveWebpackFileFromSpecifiedManifest()
    {
        clientAppService.SetupGet(c => c.Mode).Returns(ClientAppMode.FileSystem);
        bootstrapAssetsContext =
            new BootstrapAssetsContext(webpackManifestFileResolver.Object, languageService.Object, themeResolver.Object, clientAppService.Object, indexHtmlConfiguration.Object);
        bootstrapAssetsContext.SetManifestFile("ClientDist/changed-manifest.json");

        (await bootstrapAssetsContext.WebpackFileAsync("file.js", cancellationToken)).Should().Be("c-resolved");
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData(" ")]
    public async Task WebpackFile_ShouldThrowIfFileNameIsEmpty(string? name)
    {
        Func<Task> act = () => bootstrapAssetsContext.WebpackFileAsync(name!, cancellationToken);

        await act.Should().ThrowAsync<ArgumentException>();
    }

    [Fact]
    public async Task WebpackFileContent_ShouldResolveWebpackFileContent()
    {
        clientAppService.SetupGet(c => c.Mode).Returns(ClientAppMode.FileSystem);
        bootstrapAssetsContext =
            new BootstrapAssetsContext(webpackManifestFileResolver.Object, languageService.Object, themeResolver.Object, clientAppService.Object, indexHtmlConfiguration.Object);
        (await bootstrapAssetsContext.WebpackFileContentAsync("file.js", cancellationToken)).Should().Be("fcontent");
    }

    [Fact]
    public async Task WebpackFileContent_ReturnEmptyStringDevServerIsUsed()
    {
        bootstrapAssetsContext =
            new BootstrapAssetsContext(webpackManifestFileResolver.Object, languageService.Object, themeResolver.Object, clientAppService.Object, indexHtmlConfiguration.Object);

        (await bootstrapAssetsContext.WebpackFileContentAsync("file.js", cancellationToken)).Should().Be("fcontent");
    }

    [Fact]
    public async Task WebpackManifestEntries_LocalReturnCorrectData()
    {
        var data = new Dictionary<string, string>
        {
            ["test1"] = "/sports",
            ["test2"] = "/casino",
        };
        SetupClient(data);
        bootstrapAssetsContext =
            new BootstrapAssetsContext(webpackManifestFileResolver.Object, languageService.Object, themeResolver.Object, clientAppService.Object, indexHtmlConfiguration.Object);

        var entries = await bootstrapAssetsContext.GetWebpackManifestFileEntriesAsync(cancellationToken);
        entries?.Should().BeEquivalentTo(new Dictionary<string, string> { ["test1"] = "http://localhost:9999/sports", ["test2"] = "http://localhost:9999/casino" });
    }

    [Fact]
    public async Task WebpackManifestEntries_ShouldReturnFileResolverData()
    {
        var data = new Dictionary<string, string> { ["test1"] = "sports", ["test2"] = "casino" };
        webpackManifestFileResolver.Setup(w => w.GetFileAsync(It.IsAny<string>(), cancellationToken)).ReturnsAsync(data);

        clientAppService.SetupGet(c => c.Mode).Returns(ClientAppMode.FileSystem);
        bootstrapAssetsContext =
            new BootstrapAssetsContext(webpackManifestFileResolver.Object, languageService.Object, themeResolver.Object, clientAppService.Object, indexHtmlConfiguration.Object);

        var entries = await bootstrapAssetsContext.GetWebpackManifestFileEntriesAsync(cancellationToken);
        entries?.Should().BeEquivalentTo(data);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData(" ")]
    public async Task WebpackFileContent_ShouldThrowIfFileNameIsEmpty(string? name)
    {
        Func<Task> act = () => bootstrapAssetsContext.WebpackFileAsync(name!, cancellationToken);

        await act.Should().ThrowAsync<ArgumentException>();
    }

    [Fact]
    public void IsWebpackDevServerUsed_ShouldBeTrueIfWebpackDevServerIsSpecified()
    {
        bootstrapAssetsContext =
            new BootstrapAssetsContext(webpackManifestFileResolver.Object, languageService.Object, themeResolver.Object, clientAppService.Object, indexHtmlConfiguration.Object);

        bootstrapAssetsContext.Mode.Should().Be(ClientAppMode.DevServer);
    }

    [Fact]
    public void IsWebpackDevServerUsed_ShouldBeFalseIfWebpackDevServerIsNotSpecified()
    {
        clientAppService.SetupGet(c => c.Mode).Returns(ClientAppMode.FileSystem);
        bootstrapAssetsContext =
            new BootstrapAssetsContext(webpackManifestFileResolver.Object, languageService.Object, themeResolver.Object, clientAppService.Object, indexHtmlConfiguration.Object);
        bootstrapAssetsContext.Mode.Should().Be(ClientAppMode.FileSystem);
    }

    [Fact]
    public void LocalFile_ShouldReturnLocaleFileForCurrentLanguage()
    {
        clientAppService.SetupGet(c => c.Mode).Returns(ClientAppMode.FileSystem);
        languageService.SetupGet(r => r.Current).Returns(TestLanguageInfo.Get(angularLocale: "de"));
        bootstrapAssetsContext =
            new BootstrapAssetsContext(webpackManifestFileResolver.Object, languageService.Object, themeResolver.Object, clientAppService.Object, indexHtmlConfiguration.Object);
        bootstrapAssetsContext.LocaleFile().Should().Be("ClientDist/locales/de.js");
    }

    [Fact]
    public void LocalFile_ShouldReturnLocaleFileForCurrentLanguageWithSuffix()
    {
        clientAppService.SetupGet(c => c.Mode).Returns(ClientAppMode.FileSystem);
        languageService.SetupGet(r => r.Current).Returns(TestLanguageInfo.Get(angularLocale: "de"));
        bootstrapAssetsContext =
            new BootstrapAssetsContext(webpackManifestFileResolver.Object, languageService.Object, themeResolver.Object, clientAppService.Object, indexHtmlConfiguration.Object);
        bootstrapAssetsContext.LocaleFile("-suffix").Should().Be("ClientDist/locales/de-suffix.js");
    }

    [Fact]
    public void LocalFile_ShouldReturnNullIfCurrentLocaleIsEn()
    {
        languageService.SetupGet(r => r.Current).Returns(TestLanguageInfo.Get(angularLocale: "en"));

        bootstrapAssetsContext.LocaleFile().Should().BeNull();
    }

    [Fact]
    public void LocaleFile_ShouldResolveFromSpecifiedLocalePath()
    {
        clientAppService.SetupGet(c => c.Mode).Returns(ClientAppMode.FileSystem);
        languageService.SetupGet(r => r.Current).Returns(TestLanguageInfo.Get(angularLocale: "de"));
        bootstrapAssetsContext =
            new BootstrapAssetsContext(webpackManifestFileResolver.Object, languageService.Object, themeResolver.Object, clientAppService.Object, indexHtmlConfiguration.Object);
        bootstrapAssetsContext.SetLocalesPath("ClientDist/custom/locales");

        bootstrapAssetsContext.LocaleFile("-suffix").Should().Be("ClientDist/custom/locales/de-suffix.js");
    }

    [Fact]
    public void Theme_ShouldEqual()
    {
        themeResolver.Setup(r => r.GetTheme()).Returns("black");

        bootstrapAssetsContext.Theme.Should().Be("black");
    }
}
