using Frontend.Host.Features.HttpForwarding;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Xunit;

namespace Frontend.Host.Tests.Features.HttpForwarding;

public sealed class CopyAllRequestHeadersTransformerTests
{
    [Fact]
    public async Task TransformRequestAsync_ShouldCopyHeaders_WhenAdditionalHeadersAreProvided()
    {
        // Arrange
        var additionalHeaders = new Dictionary<string, IEnumerable<string>>
        {
            { "X-Custom-Header", new[] { "Value1", "Value2" } },
        };
        var transformer = new CopyAllRequestHeadersTransformer(additionalHeaders);
        var httpContext = new DefaultHttpContext();
        var proxyRequest = new HttpRequestMessage();
        var destinationPrefix = "http://example.com";
        var cancellationToken = CancellationToken.None;

        // Act
        await transformer.TransformRequestAsync(httpContext, proxyRequest, destinationPrefix, cancellationToken);

        // Assert
        proxyRequest.Headers.Contains("X-Custom-Header").Should().BeTrue();
        proxyRequest.Headers.GetValues("X-Custom-Header").Should().BeEquivalentTo("Value1", "Value2");
        proxyRequest.RequestUri.Should().Be(new Uri(destinationPrefix));
        proxyRequest.Headers.Host.Should().BeNull();
    }

    [Fact]
    public async Task TransformRequestAsync_ShouldNotThrow_WhenNoAdditionalHeadersAreProvided()
    {
        // Arrange
        var transformer = new CopyAllRequestHeadersTransformer();
        var httpContext = new DefaultHttpContext();
        var proxyRequest = new HttpRequestMessage();
        var destinationPrefix = "http://example.com";
        var cancellationToken = CancellationToken.None;

        // Act
        Func<Task> act = async () => await transformer.TransformRequestAsync(httpContext, proxyRequest, destinationPrefix, cancellationToken);

        // Assert
        await act.Should().NotThrowAsync();
        proxyRequest.RequestUri.Should().Be(new Uri(destinationPrefix));
        proxyRequest.Headers.Host.Should().BeNull();
    }
}
