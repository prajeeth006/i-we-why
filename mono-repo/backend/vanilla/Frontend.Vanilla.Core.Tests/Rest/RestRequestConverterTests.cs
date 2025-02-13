using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.Rest.Formatters;
using Frontend.Vanilla.Core.System.Uris;
using Moq;
using Xunit;
using DotNetHttpHeaders = System.Net.Http.Headers.HttpHeaders;

namespace Frontend.Vanilla.Core.Tests.Rest;

public class RestRequestConverterTests
{
    private static readonly HttpUri TestUrl = new ("http://test-host/path?q=1");
    private RestRequest request;

    public RestRequestConverterTests()
        => request = new RestRequest(TestUrl);

    [Theory]
    [InlineData(null, null)]
    [InlineData(null, "Chrome 666")]
    [InlineData("test/accept", null)]
    [InlineData("test/accept", "Chrome 666")]
    public void ShouldCreateRequestWithoutContent(string acceptHeader, string userAgent)
    {
        request.Headers.Add("X-Test-1", "Value 1");
        request.Headers.Add("X-Test-2", new[] { "Value 2.1", "Value 2.2" });
        request.Headers.Add("X-Test-3", (string)null);
        request.Method = new HttpMethod("FUCK");
        if (acceptHeader != null) request.Headers.Add(HttpHeaders.Accept, acceptHeader);
        if (userAgent != null) request.Headers.Add(HttpHeaders.UserAgent, userAgent);
        request.Timeout = TimeSpan.FromSeconds(123);

        // Act
        var result = RestRequestConverter.Convert(request);

        result.RequestUri.Should().Be(TestUrl);
        result.Method.ToString().Should().Be("FUCK");
        GetHeader(result.Headers, HttpHeaders.ContentType).Should().BeEmpty();
        result.Content.Should().BeNull();

        if (acceptHeader != null)
        {
            GetHeader(result.Headers, HttpHeaders.Accept).Should().Be(acceptHeader);
        }
        if (userAgent != null)
        {
            GetHeader(result.Headers, HttpHeaders.UserAgent).Should().Be(userAgent);
        }
        GetHeader(result.Headers, "X-Test-1").Should().Be("Value 1");
        GetHeader(result.Headers, "X-Test-2").Should().Be("Value 2.1,Value 2.2");
        GetHeader(result.Headers, "X-Test-3").Should().Be("");
    }

    [Theory]
    [InlineData(null, "test-content")] // Taken from formatter
    [InlineData("explicit", "explicit")]
    public async Task ShouldCreateWithContent(string inputAcceptHeader, string expectedAcceptHeader)
    {
        var bytes = new byte[] { 0x48, 0x65, 0x6c, 0x6c, 0x6f };
        var formatter = Mock.Of<IRestFormatter>(f => f.ContentType == "test-content" && f.Serialize("content") == bytes);
        request.Headers.Add("test-header", "header-value");
        request.Content = new RestRequestContent("content", formatter);
        if (inputAcceptHeader != null) request.Headers.Add(HttpHeaders.Accept, inputAcceptHeader);

        // Act
        var result = RestRequestConverter.Convert(request);

        result.RequestUri.Should().Be(TestUrl);
        var resultBytes = await result.Content!.ReadAsByteArrayAsync(TestContext.Current.CancellationToken);
        resultBytes.LongLength.Should().Be(bytes.LongLength);
        resultBytes.Should().Equal(bytes);
        (result.Headers.Count() + result.Content.Headers.Count()).Should().Be(4);
        GetHeader(result.Content.Headers, HttpHeaders.ContentType).Should().Be("test-content");
        GetHeader(result.Headers, "test-header").Should().Be("header-value");
        result.Headers.Accept.ToString().Should().Be(expectedAcceptHeader);
    }

    private static string GetHeader(DotNetHttpHeaders headers, string headerName)
    {
        return headers.GetValue(headerName).NullToEmpty().Join(" ");
    }
}
