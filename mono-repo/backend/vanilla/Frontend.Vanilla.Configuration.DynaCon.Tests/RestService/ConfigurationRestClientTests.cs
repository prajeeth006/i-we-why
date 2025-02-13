using System;
using System.Collections.Generic;
using System.Net;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.RestService;
using Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;
using Frontend.Vanilla.Core.Abstractions;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Testing.FluentAssertions;
using Microsoft.Extensions.Primitives;
using Moq;
using Newtonsoft.Json;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.RestService;

public sealed class ConfigurationRestClientTests
{
    private IConfigurationRestClient target;
    private Mock<IRestClient> restClient;
    private RestRequest request;

    public ConfigurationRestClientTests()
    {
        var settings = TestSettings.Get(s => s.NetworkTimeout = TimeSpan.FromSeconds(6));
        var environment = Mock.Of<IEnvironment>(e => e.MachineName == "D-Wave 2000 Quantum");
        restClient = new Mock<IRestClient>();
        target = new ConfigurationRestClient(settings, environment, restClient.Object);
        request = new RestRequest(new HttpUri("http://dynacon/path"));
    }

    public class TestData
    {
        public string TestValue { get; set; }
    }

    [Theory]
    [InlineData(200)]
    [InlineData(222)]
    public void ShouldDownloadJson(int statusCode)
    {
        restClient.Setup(c => c.Execute(request)).Returns(
            new RestResponse(request)
            {
                StatusCode = (HttpStatusCode)statusCode,
                Content = "{ TestValue: 'foo' }".EncodeToBytes(),
            });

        // Act
        var dto = target.Execute<TestData>(request);

        dto.TestValue.Should().Be("foo");
        request.Timeout.Should().Be(TimeSpan.FromSeconds(6));
        request.Headers.Should().Equal(
            new Dictionary<string, StringValues>
            {
                { HttpHeaders.Accept, ContentTypes.Json },
                { ConfigurationRestClient.MachineNameHeader, "D-Wave 2000 Quantum" },
            });
    }

    [Fact]
    public void ShouldJustMakeRequestIfObjectSpecified()
    {
        restClient.Setup(c => c.Execute(It.IsNotNull<RestRequest>())).Returns(new RestResponse(request));
        var dto = target.Execute<VoidDto>(request); // Act
        dto.Should().BeSameAs(VoidDto.Singleton);
    }

    [Fact]
    public void ShouldThrowIfNetworkException()
    {
        var nex = new Exception("Network error");
        var ex = RunExceptionTestWithResponse(() => throw nex);
        ex.Should().BeSameAs(nex);
    }

    [Fact]
    public void ShouldThrowIfInvalidJson()
    {
        var ex = RunExceptionTestWithResponse(() => new RestResponse(request) { Content = "{ invalid json".EncodeToBytes() });
        ex.InnerException.Should().BeOfType<JsonReaderException>();
    }

    [Fact]
    public void ShouldThrowIfNullDeserialized()
    {
        var ex = RunExceptionTestWithResponse(() => new RestResponse(request) { Content = "null".EncodeToBytes() });
        ex.InnerException.Should().BeOfType<NullDeserializedException>();
    }

    [Theory]
    [InlineData(HttpStatusCode.NotImplemented, "Failed request on DynaCon side. Fix it there. Response: 501 Bad Status; Duration: 00:01:23; Body: You shall not pass")]
    [InlineData(HttpStatusCode.NotFound, "Failed request to DynaCon. Response: 404 Bad Status; Duration: 00:01:23; Body: You shall not pass")]
    public void ShouldThrowIfNoSuccessAndParseOutErrorDetails(HttpStatusCode statusCode, string expectedErrorMessage)
    {
        var ex = RunExceptionTestWithResponse(
            () => new RestResponse(request)
            {
                Content = "You shall not pass".EncodeToBytes(),
                StatusCode = statusCode,
                StatusDescription = "Bad Status",
                ExecutionDuration = new TimeSpan(0, 1, 23),
            });
        ex.Message.Should().Be(expectedErrorMessage);
    }

    private Exception RunExceptionTestWithResponse(Func<RestResponse> mockResponse)
    {
        restClient.Setup(c => c.Execute(request)).Returns(mockResponse);

        Action act = () => target.Execute<TestData>(request);

        return act.Should().Throw()
            .WithMessage("Failed request to DynaCon URL: http://dynacon/path")
            .Which.InnerException;
    }
}
