using System.Net;
using FluentAssertions;
using Frontend.Host.Features.Assets;
using Frontend.Host.Features.ClientApp;
using Frontend.Vanilla.Testing.FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Server.Kestrel.Core.Internal.Http;
using Moq;
using Moq.Protected;
using Xunit;

namespace Frontend.Host.Tests.Features.Assets;

public class WebpackManifestFileResolverTests
{
    private IWebpackManifestFileResolver target;
    private Mock<IHttpContextAccessor> httpContextAccessor;
    private SameSiteHttpClient sameSiteHttpClient;
    private Mock<IClientAppService> clientAppService;
    private Mock<HttpMessageHandler> httpMessageHandler;
    private const string ResponseContent = @"{ ""main.js"": ""main-f416c603e9ea4599bb3a.js"" }";
    private CancellationToken cancellationToken = CancellationToken.None;

    public WebpackManifestFileResolverTests()
    {
        var context = new DefaultHttpContext
        {
            Request =
            {
                Path = new PathString("/test/page?q=1"),
                Scheme = HttpScheme.Https.ToString(),
                Host = new HostString("www.bwin.com"),
            },
        };
        httpMessageHandler = new Mock<HttpMessageHandler>();
        httpContextAccessor = new Mock<IHttpContextAccessor>();
        httpContextAccessor.SetupGet(c => c.HttpContext).Returns(context);
        sameSiteHttpClient = new SameSiteHttpClient(new HttpClient(httpMessageHandler.Object));
        clientAppService = new Mock<IClientAppService>();
        target = new WebpackManifestFileResolver(httpContextAccessor.Object, sameSiteHttpClient, clientAppService.Object);

        clientAppService.SetupGet(c => c.Mode).Returns(ClientAppMode.FileServer);
    }

    [Fact]
    public async Task GetFileName_ShouldGetFileNamesFromManifestFile()
    {
        SetupResponse();
        // Act
        var entry = await target.GetFileNameAsync("manifest.json", "main.js", cancellationToken);

        entry.Should().Be("main-f416c603e9ea4599bb3a.js");
    }

    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public async Task GetFileName_ShouldThrow_IfManifestNotFoundOrFailed(bool notFound)
    {
        if (notFound)
            SetupException(new FileNotFoundException());
        else
            SetupResponse(responseContent: "gibberish");

        // Act
        Func<Task> act = () => target.GetFileNameAsync("manifest.json", "wtf.js", cancellationToken);

        var ex = (await act.Should().ThrowAsync<Exception>()).Which;
        ex.Message.Should().Contain(@"manifest.json");
    }

    [Fact]
    public async Task GetFileName_ShouldThrow_IfRecordNotFound()
    {
        SetupResponse();
        // Act
        Func<Task> act = () => target.GetFileNameAsync("manifest.json", "wtf.js", cancellationToken);

        (await act.Should().ThrowAsync<Exception>())
            .Which.Message.Should().ContainAll("'wtf.js'", @"'FileServer manifest.json'", "'manifest.json'");
    }

    [Fact]
    public async Task GetFileContent_ShouldGetFileContentFromManifestFile()
    {
        SetupResponse();
        SetupResponse("main-f416c603e9ea4599bb3a.js", "fcontent");

        // Act
        var content = await target.GetFileContentAsync("manifest.json", "main.js", cancellationToken);

        content.Should().Be("fcontent");
    }

    [Fact]
    public async Task GetFileContent_ShouldThrow_IfFailedToReadFile()
    {
        var fileEx = new Exception("File error.");
        SetupResponse();
        SetupException(fileEx, "main.js");

        // Act
        Func<Task> act = () => target.GetFileContentAsync("manifest.json", "main.js", cancellationToken);

        var ex = (await act.Should().ThrowAsync<Exception>()).Which;
        ex.Message.Should().Contain(@"main-f416c603e9ea4599bb3a.js");
    }

    private void SetupResponse(string path = "manifest.json", string responseContent = ResponseContent)
    {
        httpMessageHandler.Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.Is<HttpRequestMessage>(req => req.RequestUri!.PathAndQuery.Contains(path)),
                ItExpr.IsAny<CancellationToken>())
            .ReturnsAsync((HttpRequestMessage _, CancellationToken _) =>
            {
                var response = new HttpResponseMessage
                {
                    Content = new StringContent(responseContent),
                    StatusCode = HttpStatusCode.OK,
                };

                return response;
            });
    }

    private void SetupException(Exception exception, string path = "manifest.json")
    {
        httpMessageHandler.Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.Is<HttpRequestMessage>(req => req.RequestUri!.PathAndQuery.Contains(path)),
                ItExpr.IsAny<CancellationToken>())
            .ThrowsAsync(exception);
    }
}
