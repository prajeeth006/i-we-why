#nullable enable
using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Uris;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Rest;

public class RestResponseConverterTests
{
    private readonly RestRequest request;

    public RestResponseConverterTests()
    {
        // Set up a sample RestRequest for testing
        request = new RestRequest(new HttpUri("http://test-url.com"));
    }

    [Fact]
    public async Task ConvertAsync_ShouldReturnRestResponse_WithContentAndHeaders()
    {
        // Arrange
        var httpResponse = new HttpResponseMessage(HttpStatusCode.OK)
        {
            ReasonPhrase = "OK",
            Content = new StringContent("Test content"),
        };
        httpResponse.Headers.Add("Custom-Header", "HeaderValue");

        // Simulate the execution duration
        var executionDuration = TimeSpan.FromMilliseconds(150);

        // Act
        var result = await RestResponseConverter.ConvertAsync(httpResponse, request, executionDuration);

        // Assert
        result.Should().NotBeNull();
        result.StatusCode.Should().Be(HttpStatusCode.OK);
        result.StatusDescription.Should().Be("OK");
        result.ExecutionDuration.Should().Be(executionDuration);
        result.Content.Should().BeEquivalentTo(new byte[] { 84, 101, 115, 116, 32, 99, 111, 110, 116, 101, 110, 116 }); // ASCII values for "Test content"
        result.Headers.Should().ContainKey("Custom-Header").WhoseValue.Should().BeEquivalentTo(new[] { "HeaderValue" });
    }

    [Fact]
    public async Task ConvertAsync_ShouldHandleEmptyResponseContent()
    {
        // Arrange
        var httpResponse = new HttpResponseMessage(HttpStatusCode.NoContent)
        {
            ReasonPhrase = "No Content",
        };

        var executionDuration = TimeSpan.FromMilliseconds(100);

        // Act
        var result = await RestResponseConverter.ConvertAsync(httpResponse, request, executionDuration);

        // Assert
        result.Should().NotBeNull();
        result.StatusCode.Should().Be(HttpStatusCode.NoContent);
        result.StatusDescription.Should().Be("No Content");
        result.Content.Should().BeEmpty();
        result.ExecutionDuration.Should().Be(executionDuration);
    }
}
