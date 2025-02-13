using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;
using Frontend.Vanilla.ServiceClients.Services;
using Frontend.Vanilla.ServiceClients.Services.Crm.CampaignDatas;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Crm.CampaignDatas;

public sealed class CampaignDataServiceClientTests
{
    [Fact]
    public void ShouldReferToCorrectData()
    {
        var target = new CampaignDataServiceClient(Mock.Of<IGetDataServiceClient>());

        target.DataUrl.Should().Be(PosApiEndpoint.Crm.CampaignData);
        target.CacheKey.Should().Be("UserCampaigns"); // Used with distributed cache -> must match between products -> don't change!!!
    }
}
