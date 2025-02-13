using System.Net;
using System.Text;
using FluentAssertions;
using Frontend.Host.Features.Assets;
using Frontend.Host.Features.ClientApp;
using Frontend.Vanilla.Core.Caching.Isolation;
using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Features.WebIntegration.Configuration.DynaCon;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.Extensions.Caching.Distributed;
using Moq;
using Moq.Protected;
using Xunit;

namespace Frontend.Host.Tests.Features.ClientApp;

public class ClientAppServiceTests
{
    private IClientAppService? target;
    private readonly Mock<IClientAppConfiguration> config;
    private VanillaVersion clientAppVersion;
    private readonly ClientAppHttpClient clientAppHttpClient;
    private readonly VanillaVersion vanillaVersion = VanillaVersion.CreateInstance();
    private readonly Mock<HttpMessageHandler> httpMessageHandler;
    private readonly Mock<ILabelIsolatedDistributedCache> labelIsolatedCache;
    private readonly Mock<IDynaConParameterExtractor> dynaconParameterExtractor;
    private readonly Mock<IWebpackDevServerConfiguration> webpackDevServerConfiguration;
    private readonly TestLogger<IClientAppService> log;

    private const string CacheKey = $"host1.0.0-dev{ClientAppService.CacheKey}";
    private CancellationToken cancellationToken = CancellationToken.None;

    private const string ResponseContent = """
                                           [
                                           "1.0.0.0",
                                           "1.0.1.0",
                                           "1.1.1.123",
                                           "1.1.7.1",
                                           "1.2.1.1",
                                           "2.0.0.0",
                                           "12.43.100.1"
                                           ]
                                           """;

    public ClientAppServiceTests()
    {
        httpMessageHandler = new Mock<HttpMessageHandler>();
        clientAppHttpClient = new ClientAppHttpClient(new HttpClient(httpMessageHandler.Object));
        SetupResponse();

        clientAppVersion = new VanillaVersion(1, 0, 0, 0, "dev");
        config = new Mock<IClientAppConfiguration>();
        webpackDevServerConfiguration = new Mock<IWebpackDevServerConfiguration>();
        webpackDevServerConfiguration.SetupGet(c => c.Url).Returns("https://localhost:9999/");
        config.SetupGet(c => c.FileServerRollForwardStrategy).Returns(FileServerRollForwardStrategy.Disable);
        config.SetupGet(c => c.FileServerHost).Returns(new Uri("https://cdn.vanilla.intranet/vanilla-testweb"));
        config.SetupGet(c => c.FileServerVersionCacheTime).Returns(TimeSpan.FromMinutes(1));
        config.SetupGet(c => c.ForceSpecificVersion).Returns(null as Version);
        config.SetupGet(c => c.Mode).Returns(ClientAppMode.FileServer);
        labelIsolatedCache = new Mock<ILabelIsolatedDistributedCache>();
        dynaconParameterExtractor = new Mock<IDynaConParameterExtractor>();
        log = new TestLogger<IClientAppService>();
        dynaconParameterExtractor.SetupGet(d => d.Product).Returns("host");
        labelIsolatedCache.Setup(c => c.GetAsync(CacheKey, It.IsAny<CancellationToken>()))
            .ReturnsAsync(null as byte[]);
    }

    private void SetupResponse()
    {
        httpMessageHandler.Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>())
            .ReturnsAsync((HttpRequestMessage _, CancellationToken _) =>
            {
                var response = new HttpResponseMessage
                {
                    Content = new StringContent(ResponseContent),
                    StatusCode = HttpStatusCode.OK,
                };

                return response;
            });
    }

    [Fact]
    public async Task ShouldReturnCachedVersion()
    {
        var expected = new Version(1, 2, 3, 4);
        labelIsolatedCache.Setup(c => c.GetAsync(CacheKey, It.IsAny<CancellationToken>()))
            .ReturnsAsync("1.2.3.4"u8.ToArray());
        target = new ClientAppService(
            vanillaVersion,
            dynaconParameterExtractor.Object,
            labelIsolatedCache.Object,
            clientAppHttpClient,
            config.Object,
            clientAppVersion,
            webpackDevServerConfiguration.Object,
            log);

        var version = await target.GetCurrentVersionAsync(cancellationToken);
        version.Should().Be(expected);
    }

    [Fact]
    public async Task ShouldStoreAndReturnSameVersionWhenDisableStrategy()
    {
        target = new ClientAppService(
            vanillaVersion,
            dynaconParameterExtractor.Object,
            labelIsolatedCache.Object,
            clientAppHttpClient,
            config.Object,
            clientAppVersion,
            webpackDevServerConfiguration.Object,
            log);

        var version = await target.GetCurrentVersionAsync(cancellationToken);

        version.Should().Be(new Version(1,  0, 0, 0));
        labelIsolatedCache.Verify(c => c.SetAsync(CacheKey,
            Encoding.UTF8.GetBytes(clientAppVersion.Version.ToString()),
            It.Is<DistributedCacheEntryOptions>(o => o.AbsoluteExpirationRelativeToNow == TimeSpan.FromMinutes(1)),
            It.IsAny<CancellationToken>()));
    }

    [Fact]
    public async Task ShouldReturnCorrectPatchVersion()
    {
        config.SetupGet(c => c.FileServerRollForwardStrategy).Returns(FileServerRollForwardStrategy.LatestPatch);
        target = new ClientAppService(
            vanillaVersion,
            dynaconParameterExtractor.Object,
            labelIsolatedCache.Object,
            clientAppHttpClient,
            config.Object,
            clientAppVersion,
            webpackDevServerConfiguration.Object,
            log);
        var version = await target.GetCurrentVersionAsync(cancellationToken);

        version.ToString().Should().Be("1.0.1.0");
    }

    [Fact]
    public async Task ShouldReturnCorrectMinorVersion()
    {
        target = new ClientAppService(
            vanillaVersion,
            dynaconParameterExtractor.Object,
            labelIsolatedCache.Object,
            clientAppHttpClient,
            config.Object,
            clientAppVersion,
            webpackDevServerConfiguration.Object,
            log);
        config.SetupGet(c => c.FileServerRollForwardStrategy).Returns(FileServerRollForwardStrategy.LatestMinor);

        var version = await target.GetCurrentVersionAsync(cancellationToken);
        version.ToString().Should().Be("1.2.1.1");
    }

    [Fact]
    public async Task ShouldReturnExactVersionRegardlessOfRollForwardStrategy()
    {
        var exactVersion = new Version(1, 5, 10, 123);
        target = new ClientAppService(
            vanillaVersion,
            dynaconParameterExtractor.Object,
            labelIsolatedCache.Object,
            clientAppHttpClient,
            config.Object,
            clientAppVersion,
            webpackDevServerConfiguration.Object,
            log);
        config.SetupGet(c => c.FileServerRollForwardStrategy).Returns(FileServerRollForwardStrategy.LatestMinor);
        config.SetupGet(c => c.ForceSpecificVersion).Returns(exactVersion);

        var version = await target.GetCurrentVersionAsync(cancellationToken);
        version.Should().Be(exactVersion);
    }

    [Theory]
    [InlineData(
        3,
        0,
        0,
        0,
        FileServerRollForwardStrategy.LatestPatch,
        "Failed to retrieve version using strategy LatestPatch and version 3.0.0.0 in 1.0.0.0,1.0.1.0,1.1.1.123,1.1.7.1,1.2.1.1,2.0.0.0,12.43.100.1")]
    [InlineData(
        4,
        0,
        0,
        123,
        FileServerRollForwardStrategy.LatestMinor,
        "Failed to retrieve version using strategy LatestMinor and version 4.0.0.123 in 1.0.0.0,1.0.1.0,1.1.1.123,1.1.7.1,1.2.1.1,2.0.0.0,12.43.100.1")]
    [InlineData(0, 0, 0, 0, FileServerRollForwardStrategy.Disable, "Version 0.0.0.0 is not found in 1.0.0.0,1.0.1.0,1.1.1.123,1.1.7.1,1.2.1.1,2.0.0.0,12.43.100.1")]
    internal async Task ShouldThrow(int major, int minor, int patch, int revision, FileServerRollForwardStrategy strategy, string message)
    {
        config.SetupGet(c => c.FileServerRollForwardStrategy).Returns(strategy);
        clientAppVersion = new VanillaVersion(major, minor, patch, revision, "hash");
        target = new ClientAppService(
            vanillaVersion,
            dynaconParameterExtractor.Object,
            labelIsolatedCache.Object,
            clientAppHttpClient,
            config.Object,
            clientAppVersion,
            webpackDevServerConfiguration.Object,
            log);
        var ex = await Assert.ThrowsAsync<ClientAppNoSuitableVersionException>(() => target.GetCurrentVersionAsync(cancellationToken));
        ex.Message.Should().Be(message);
    }
}
