using System.Text;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Services.Crm.MappedQuery;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Crm.MappedQuery;

public class MappedQueryServiceClientTests : ServiceClientTestsBase
{
    private MappedQueryServiceClient target;
    private Mock<ILogger<MappedQueryServiceClient>> logger;

    protected override void Setup()
    {
        logger = new Mock<ILogger<MappedQueryServiceClient>>();
        target = new MappedQueryServiceClient(RestClient.Object, logger.Object);
    }

    [Theory]
    [InlineData("?refererId=WTF", 1)]
    [InlineData("?btag=WTF", 2)]
    [InlineData("?btag=WTF&wm=123", 2)]
    [InlineData("?bTag=WTF&wmId=123", 2)]
    [InlineData("?refererId=WTF&other=1", 2)]
    [InlineData("?btag=WTF&other=1", 3)]
    [InlineData("?btag=WTF&wmid=123&other=1", 3)]
    [InlineData("?affid=112233", 2)]
    [InlineData("?affid=112233&btag=WTF", 3)]
    public async Task GetQueryWithTrackerIdAsync_ShouldExecuteCorrectly(string query, int count)
    {
        RestClientResult = new MappedTrackerIdDto { TrackerId = 666 };

        var result = await target.GetAsync(TestMode, QueryUtil.Parse(query), false); // Act

        var resultingQuery = result.Query;

        resultingQuery.Count.Should().Be(count, "Unexpected number of querystring parameters.");
        resultingQuery["trackerId"].ToString().Should().Be("666", "Unexpected TrackerId value.");
        result.Modified.Should().BeTrue("Expected result to be modified.");

        var url = CreateExpectedPosApiUrl(query);

        VerifyRestClient_ExecuteAsync(url, resultType: typeof(MappedTrackerIdDto));
    }

    [Fact]
    public async Task ShouldReturnUnmodifiedResult_WhenTrackerIdAlreadyinQuerystring()
    {
        RestClientResult = new MappedTrackerIdDto { TrackerId = 666 };

        var result = await target.GetAsync(TestMode, QueryUtil.Parse("?trackerId=666&btag=WTF")); // Act

        var resultingQuery = result.Query;

        resultingQuery.Count.Should().Be(2, "Unexpected number of querystring parameters.");
        resultingQuery["trackerId"].ToString().Should().Be("666", "Unexpected TrackerId value.");
        result.Modified.Should().BeFalse("Expected result not to be modified.");
    }

    private static string CreateExpectedPosApiUrl(string query)
    {
        var qs = QueryUtil.Parse(query);
        var url = new StringBuilder("CRM.svc/");

        if (qs.TryGetValue("refererId", out var refererValue))
        {
            url.AppendFormat("MappedTrackerId?referrerId={0}", refererValue);
        }
        else
        {
            url.Append("WmIdForBTag?");

            if (qs.TryGetValue("btag", out var bTagValue))
            {
                url.AppendFormat("btag={0}", bTagValue);

                var wmIdValue = qs.GetValue("wmid").Count != 0 ? qs.GetValue("wmid") : qs.GetValue("wm");

                if (!string.IsNullOrEmpty(wmIdValue))
                {
                    url.AppendFormat("&wmid={0}", wmIdValue);
                }
            }

            if (qs.TryGetValue("affid", out var affIDValue))
            {
                if (!url.ToString().EndsWith("?"))
                    url.Append("&");
                url.AppendFormat("affid={0}", affIDValue);
            }
        }

        return url.ToString();
    }
}
