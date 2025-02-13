using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Host.Features.HttpForwarding;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Features.Hosting;
using Frontend.Vanilla.Testing.Fakes;

namespace Frontend.Host.Tests.Features.HttpForwarding;

public class EngagementMicroAppsHttpForwarderProviderTests
{
    private readonly Mock<IEnvironmentProvider> environmentProviderMock;
    private readonly EngagementMicroAppsHttpForwarderProvider target;
    private readonly ProductApiHttpClient productApiHttpClient;

    public EngagementMicroAppsHttpForwarderProviderTests()
    {
        environmentProviderMock = new Mock<IEnvironmentProvider>();
        environmentProviderMock.Setup(e => e.Environment).Returns("TestEnvironment");
        productApiHttpClient = new ProductApiHttpClient(
            Mock.Of<IProductApiConfiguration>(c => c.Host == "http://{site}-{group}.{productApi}.{env}.env.works"),
            Mock.Of<IHttpClientFactory>(),
            Mock.Of<IDataCenterResolver>(d => d.Group == DataCenterGroup.Default && d.Site == DataCenter.NonProd),
            Mock.Of<IEnvironmentProvider>(c => c.Environment == "dev"),
            Mock.Of<ICurrentLanguageResolver>(c => c.Language == TestLanguageInfo.Get(null, null, null, null, null, null, null)));

        target = new EngagementMicroAppsHttpForwarderProvider(environmentProviderMock.Object, productApiHttpClient);
    }

    [Fact]
    public void GetDestinationUrl_ShouldBeCorrect()
    {
        // Arrange
        var httpContext = new DefaultHttpContext
        {
            Request =
            {
                Scheme = "https",
                Host = new HostString("example.com"),
                Path = "/test",
                QueryString = new QueryString("?query=1"),
            },
        };

        // Act
        var result = target.GetDestinationUrl(httpContext);

        // Assert
        result.Should().Be("http://at1at2-dev-default.engagement-api.dev.env.works/test?query=1");
    }

    [Fact]
    public void Other_ShouldReturnExpectedValue()
    {
        // Assert
        target.Order.Should().Be(2);
        target.PathPattern.Should().Be("/{culture}/engage/lan/{**catchall}");
    }

    [Fact]
    public void Transformer_ShouldReturnExpectedTypeAndHeaders()
    {
        // Act
        var transformer = target.Transformer;

        // Assert
        transformer.Should().BeOfType<CopyAllRequestHeadersTransformer>();
    }
}
