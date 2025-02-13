using FluentAssertions;
using Frontend.Host.Features.HttpForwarding;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Host.Tests.Features.HttpForwarding;

public class DefaultHttpForwarderProviderTests
{
    private readonly Mock<ILogger<DefaultHttpForwarderProvider>> loggerMock;
    private readonly Mock<IHttpForwardingConfiguration> configurationMock;
    private readonly IHttpForwarderProvider target;

    public DefaultHttpForwarderProviderTests()
    {
        loggerMock = new Mock<ILogger<DefaultHttpForwarderProvider>>();
        configurationMock = new Mock<IHttpForwardingConfiguration>();
        configurationMock.Setup(c => c.WhitelistedHosts).Returns(new Dictionary<string, string>
        {
            { "1", "example.com" },
        });

        target = new DefaultHttpForwarderProvider(loggerMock.Object, configurationMock.Object);
    }

    [Theory]
    [InlineData("http://example.com")]
    [InlineData("http://test.example.com")]
    [InlineData("http://qa2-example.com")]
    public void GetDestinationUrl_ShouldReturnUrl_WhenValidUrlProvided(string url)
    {
        // Arrange
        var httpContext = new DefaultHttpContext
        {
            Request =
            {
                QueryString = new QueryString($"?url={url}"),
            },
        };

        // Act
        var result = target.GetDestinationUrl(httpContext);

        // Assert
        result.Should().Be(url);
    }

    [Fact]
    public void GetDestinationUrl_ShouldReturnNull_AndLogError_WhenInvalidUrlProvided()
    {
        // Arrange
        var httpContext = new DefaultHttpContext
        {
            Request =
            {
                QueryString = new QueryString("?url=invalid-url"),
            },
        };

        // Act
        var result = target.GetDestinationUrl(httpContext);

        // Assert
        result.Should().BeNull();
        loggerMock.Verify(
            x => x.Log(
                LogLevel.Error,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("invalid-url couldn't be parsed.")),
                null,
                It.IsAny<Func<It.IsAnyType, Exception, string>>()!),
            Times.Once);
    }

    [Fact]
    public void GetDestinationUrl_ShouldReturnNull_AndLogWarning_WhenUrlNotWhitelisted()
    {
        // Arrange
        configurationMock.Setup(c => c.WhitelistedHosts).Returns(new Dictionary<string, string>());
        var httpContext = new DefaultHttpContext
        {
            Request =
            {
                QueryString = new QueryString("?url=http://notwhitelisted.com"),
            },
        };

        // Act
        var result = target.GetDestinationUrl(httpContext);

        // Assert
        result.Should().BeNull();
        loggerMock.Verify(
            x => x.Log(
                LogLevel.Warning,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("notwhitelisted.com is not whitelisted.")),
                null,
                It.IsAny<Func<It.IsAnyType, Exception, string>>()!),
            Times.Once);
    }

    [Fact]
    public void GetDestinationUrl_ShouldReturnNull_WhenUrlQueryParameterIsMissing()
    {
        // Arrange
        var httpContext = new DefaultHttpContext();

        // Act
        var result = target.GetDestinationUrl(httpContext);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public void Other_ShouldReturnExpectedValue()
    {
        // Assert
        target.Order.Should().Be(1);
        target.PathPattern.Should().Be("/reverse-proxy");
        target.Transformer.Should().BeOfType<CopyAllRequestHeadersTransformer>();
    }
}
