using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services;
using Frontend.Vanilla.ServiceClients.Services.Notification.EdsGroup;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Notification.EdsGroup;

public class EdsGroupStatusServiceClientTests : ServiceClientTestsBase
{
    private IEdsGroupStatusServiceClient target;

    protected override void Setup()
    {
        target = new EdsGroupStatusServiceClient(RestClient.Object, Cache.Object);
    }

    [Fact]
    public async Task ShouldExecuteCorrectly_GetAsync()
    {
        var date = DateTime.Now;
        RestClientResult = new EdsGroupStatusResponse()
        {
            CampaignDetails = new[]
            {
                new CampaignDetails(56, "group 56", "Opted_In", date),
            },
            GroupOptinStatusParameters = new Dictionary<string, string>()
            {
                { "Key1", "Value1" },
            },
        };
        var result = await target.GetAsync(TestMode, "473", true); // Act

        result.Should().BeEquivalentTo(new EdsGroupStatus(
            new[] { new CampaignDetails(56, "group 56", "Opted_In", date), },
            new Dictionary<string, string>() { { "Key1", "Value1" }, }));

        VerifyRestClient_ExecuteAsync("Notification.svc/eds/group/473/optin/status", authenticate: true, resultType: typeof(EdsGroupStatusResponse));
        VerifyCache_GetOrCreateAsync<EdsGroupStatus>(PosApiDataType.User, "EdsGroupStatus");
    }

    [Fact]
    public async Task ShouldExecuteCorrectly_PostAsync()
    {
        RestClientResult = new EdsGroupOptInResponse { OptinStatus = true };
        var request = new EdsGroupOptInRequest()
        {
            EventId = "598",
            Optin = true,
            Source = "sports",
        };

        var result = await target.PostAsync(TestMode, request); // Act

        result.Should().BeEquivalentTo(new EdsGroupOptIn(true));

        VerifyRestClient_ExecuteAsync(
            PosApiEndpoint.Notification.EdsGroupOptIn.ToString(),
            HttpMethod.Post,
            authenticate: true,
            content: request,
            resultType: typeof(EdsGroupOptInResponse));
    }
}
