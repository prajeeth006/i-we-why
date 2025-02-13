using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Crm.TrackerUrl;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Crm.TrackerUrl;

public class TrackerUrlServiceClientTests : ServiceClientTestsBase
{
    private ITrackerUrlServiceClient target;

    protected override void Setup()
    {
        target = new TrackerUrlServiceClient(RestClient.Object);
    }

    public static readonly IEnumerable<object[]> TestCases = new[]
    {
        new object[] { null, null, new RestRequestHeaders() },
        new object[]
        {
            "mobile", "sports", new RestRequestHeaders
            {
                { PosApiHeaders.ChannelId, "mobile" },
                { PosApiHeaders.ProductId, "sports" },
            },
        },
    };

    [Theory, MemberData(nameof(TestCases))]
    public async Task ShouldExecuteCorrectly(string channelId, string productId, RestRequestHeaders expectedHeaders)
    {
        RestClientResult = new TrackerUrlDto { Url = "http://tracker" };

        // Act
        var result = await target.GetAsync(TestMode, 123, "xxx", channelId, productId);

        result.Should().Be("http://tracker");
        VerifyRestClient_ExecuteAsync("CRM.svc/TrackerUrl?webmasterId=123&tdUid=xxx", authenticate: true, headers: expectedHeaders, resultType: typeof(TrackerUrlDto));
    }
}
