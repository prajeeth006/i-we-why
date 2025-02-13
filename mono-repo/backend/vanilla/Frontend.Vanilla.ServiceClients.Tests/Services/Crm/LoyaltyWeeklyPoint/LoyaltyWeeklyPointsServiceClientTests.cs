using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;
using Frontend.Vanilla.ServiceClients.Services;
using Frontend.Vanilla.ServiceClients.Services.Crm.LoyaltyWeeklyPoint;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Crm.LoyaltyWeeklyPoint;

public class LoyaltyWeeklyPointsServiceClientTests
{
    [Fact]
    public void ShouldReferToCorrectData()
    {
        var target = new LoyaltyWeeklyPointsServiceClient(Mock.Of<IGetDataServiceClient>());

        target.DataUrl.Should().Be(PosApiEndpoint.Crm.WeekPoints);
        target.CacheKey.Should().Be("ThisWeeksPoints"); // Used with distributed cache -> must match between products -> don't change!!!
    }
}
