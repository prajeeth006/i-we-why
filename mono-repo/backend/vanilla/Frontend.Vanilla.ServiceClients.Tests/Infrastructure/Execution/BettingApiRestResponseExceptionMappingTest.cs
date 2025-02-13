using System;
using System.Net;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Rest;
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

public class BettingApiRestResponseExceptionMappingTest
{
    private readonly PosApiRestRequest request;
    private readonly Mock<IRestClient> restClient;
    private readonly ExecutionMode mode;
    private readonly PosApiRestClientBase posApiRestClient;
    private readonly RestResponse responseToReturn;

    public BettingApiRestResponseExceptionMappingTest()
    {
        request = new BettingApiRestRequest(new PathRelativeUri("path"));
        restClient = new Mock<IRestClient>();
        mode = TestExecutionMode.Get();
        responseToReturn = new RestResponse(new RestRequest(new HttpUri("http://test")));
        responseToReturn.Content =
            @"{
                ""title"": ""BadRequest"",
                ""status"": 400,
                ""detail"": ""Failed to find language info for 'gn'. (Parameter 'culture')"",""correlationId"": ""9147d89c3421c624""
            }".EncodeToBytes();

        responseToReturn.StatusCode = HttpStatusCode.BadRequest;

        var configFactory = new ServiceClientsConfigurationBuilder
            { AccessId = "abc", Host = new Uri("http://www.bpos.com") }.Build();
        var builder1 = new Mock<IPosApiRestRequestBuilder>();
        IPosApiRestRequestFactory restRequestFactory = new PosApiRestRequestFactory(configFactory, new[] { builder1.Object });

        var trafficHealthState = new Mock<ITrafficHealthState>();
        posApiRestClient = new PosApiRestClient(restClient.Object, restRequestFactory, trafficHealthState.Object);
    }

    [Fact]
    public async Task ShouldMapBettingRestResponseException()
    {
        restClient.SetupWithAnyArgs(c => c.ExecuteAsync(default, null)).ReturnsAsync(responseToReturn);

        (await posApiRestClient.Invoking(x => x.ExecuteAsync(mode, request))
                .Should()
                .ThrowAsync<PosApiException>())
            .Where(x => x.Message.Contains("Failed processing request GET http://www.bpos.com/V3/path"))
            .WithInnerException<PosApiException>()
            .Where(x => x.Message.Contains("CorrelationId: 9147d89c3421c624"));
    }
}
