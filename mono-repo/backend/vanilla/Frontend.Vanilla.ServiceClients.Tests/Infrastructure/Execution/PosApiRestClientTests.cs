using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.Rest.Formatters;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.Diagnostics;
using Frontend.Vanilla.ServiceClients.Infrastructure.Execution;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Infrastructure.Execution;

public class PosApiRestClientTests
{
    private PosApiRestClientBase target;
    private Mock<IRestClient> restClient;
    private Mock<IPosApiRestRequestFactory> restRequestFactory;
    private Mock<ITrafficHealthState> trafficHealthState;

    private PosApiRestRequest inputPosApiRequest;
    private RestRequest restRequest;
    private RestResponse restResponseToReturn;
    private ExecutionMode mode;

    public PosApiRestClientTests()
    {
        restClient = new Mock<IRestClient>();
        restRequestFactory = new Mock<IPosApiRestRequestFactory>();
        trafficHealthState = new Mock<ITrafficHealthState>();
        target = new PosApiRestClient(restClient.Object, restRequestFactory.Object, trafficHealthState.Object);

        inputPosApiRequest = new PosApiRestRequest(new PathRelativeUri("Service.svc/Method"));
        restRequest = new RestRequest(new HttpUri("http://posapi/")) { Headers = { { "X-Custom", "Test" } } };
        restResponseToReturn = new RestResponse(new RestRequest(new HttpUri("http://test")));
        mode = TestExecutionMode.Get();

        restRequestFactory.Setup(f => f.CreateRestRequest(inputPosApiRequest)).Returns(restRequest);
        restClient.SetupWithAnyArgs(c => c.ExecuteAsync(default, null)).ReturnsAsync(restResponseToReturn);
    }

    public class Person
    {
        public string Name { get; set; }
    }

    [Fact]
    public void Formatter_ShouldBeNewtonsoftJson()
        => PosApiRestClient.Formatter.Should().BeOfType<NewtonsoftJsonFormatter>();

    [Fact]
    public async Task ShouldExecuteWithNoResult_IfNoResultTypeProvided()
    {
        await target.ExecuteAsync(mode, inputPosApiRequest);

        VerifyCommonSuccess();
    }

    [Fact]
    public async Task ReturnValue_ShouldExecuteSuccessfullyAndDeserializeResult()
    {
        restResponseToReturn.Content = @"{ ""name"": ""Chuck Norris"" }".EncodeToBytes();

        var result = await target.ExecuteAsync<Person>(mode, inputPosApiRequest);

        result.Should().BeOfType<Person>().Which.Name.Should().Be("Chuck Norris");
        VerifyCommonSuccess();
    }

    private void VerifyCommonSuccess()
    {
        restClient.Verify(c => c.ExecuteAsync(mode, restRequest));
        VerifyHealthStateSet(expectedError: null);
    }

    private void VerifyHealthStateSet(Exception expectedError, Times? times = null)
    {
        times = times ?? Times.Once();
        trafficHealthState.VerifyWithAnyArgs(s => s.Set(null), times.Value);
        trafficHealthState.Verify(
            s => s.Set(It.Is<HealthCheckResult>(r =>
                r.Error == expectedError
                && r.Details.Equals($"Based on CACHED result of recent request {restRequest}."))),
            times.Value);
    }

    public static readonly IEnumerable<object[]> HttpStatusCodeTestCases = new[]
    {
        new object[] { HttpStatusCode.MethodNotAllowed, "405 MethodNotAllowed", Times.Never() },
        new object[] { HttpStatusCode.Redirect, "302 Found", Times.Never() },
        new object[] { HttpStatusCode.InternalServerError, "500 InternalServerError", Times.Once() },
    };

    [Theory, MemberData(nameof(HttpStatusCodeTestCases))]
    public void ShouldThrowAndParseOutDetails_IfResponseNotSuccess_AndDetailsIncluded(HttpStatusCode statusCode, string reportedStatus, Times healthStateSetTimes)
        => RunPosApiErrorTest(
            statusCode,
            healthStateSetTimes,
            responseContent: @"{
                    ""code"": 666,
                    ""message"": ""Oups"",
                    ""values"": [
                        { ""Key"": ""key1"", ""Value"": ""value1"" },
                        { ""Key"": ""key2"", ""Value"": ""value2"" }
                    ]
                }",
            expectedExceptionMsg: $"PosAPI response doesn't indicate success: {reportedStatus}."
                                  + " Fix your request according to details from PosAPI or investigate it on their side. PosApiCode: 666, PosApiMessage: Oups",
            expectedInnerExceptionType: null,
            expectedPosApiCode: 666,
            expectedPosApiMsg: "Oups",
            expectedPosApiValues: new Dictionary<string, string>
            {
                { "key1", "value1" },
                { "key2", "value2" },
            });

    [Theory, MemberData(nameof(HttpStatusCodeTestCases))]
    public void ShouldThrowWithoutDetails_IfResponseNotSuccess_AndNoDetailsAvailable(HttpStatusCode statusCode, string reportedStatus, Times healthStateSetTimes)
        => RunPosApiErrorTest(
            statusCode,
            healthStateSetTimes,
            responseContent: "blah blah",
            expectedExceptionMsg: $"PosAPI response doesn't indicate success: {reportedStatus}."
                                  + " Fix your request according to details from PosAPI or investigate it on their side. Also response contains invalid error details (see inner exception).",
            expectedInnerExceptionType: typeof(RestResponseDeserializationException));

    private void RunPosApiErrorTest(
        HttpStatusCode statusCode,
        Times healthStateSetTimes,
        string responseContent,
        string expectedExceptionMsg,
        Type expectedInnerExceptionType,
        int expectedPosApiCode = 0,
        string expectedPosApiMsg = null,
        Dictionary<string, string> expectedPosApiValues = null)
    {
        restResponseToReturn.StatusCode = statusCode;
        restResponseToReturn.Content = responseContent.EncodeToBytes();

        var act = () => target.ExecuteAsync(mode, inputPosApiRequest);

        var paex = act.Should().ThrowAsync<PosApiException>().Result.Which;
        paex.Message.Should().Be($"Failed processing request {restRequest} with headers: X-Custom='Test'.");
        (paex.InnerException?.Message).Should().Be(expectedExceptionMsg);
        (paex.InnerException?.InnerException?.GetType()).Should().Be(expectedInnerExceptionType);
        paex.HttpCode.Should().Be(statusCode);
        paex.PosApiCode.Should().Be(expectedPosApiCode);
        paex.PosApiMessage.Should().Be(expectedPosApiMsg);
        paex.PosApiValues.Should().Equal(expectedPosApiValues ?? new Dictionary<string, string>());
        VerifyHealthStateSet(paex, healthStateSetTimes);
    }

    [Fact]
    public async Task ShouldRethrow_IfNetworkError()
    {
        var networkEx = new RestNetworkException();
        restClient.SetupWithAnyArgs(c => c.ExecuteAsync(default, null))
            .Callback<ExecutionMode, RestRequest>((m, r) => restRequest = r)
            .ThrowsAsync(networkEx);

        var act = () => target.ExecuteAsync(mode, inputPosApiRequest);

        var ex = (await act.Should().ThrowAsync<PosApiException>()).Which;
        ex.InnerException.Should().BeSameAs(networkEx);
        VerifyHealthStateSet(expectedError: ex);
    }

    [Fact]
    public async Task ShouldRethrow_IfDeserializationError_StillSettingSuccessHealth()
    {
        restResponseToReturn.Content = "blah blah".EncodeToBytes();

        Func<Task> act = () => target.ExecuteAsync<Person>(mode, inputPosApiRequest);

        var ex = (await act.Should().ThrowAsync<PosApiException>()).Which;
        ex.InnerException.Should().BeOfType<RestResponseDeserializationException>();
        VerifyHealthStateSet(expectedError: null);
    }
}
