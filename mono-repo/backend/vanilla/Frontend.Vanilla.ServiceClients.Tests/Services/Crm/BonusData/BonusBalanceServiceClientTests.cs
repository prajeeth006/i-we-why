using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;
using Frontend.Vanilla.ServiceClients.Services;
using Frontend.Vanilla.ServiceClients.Services.Crm.BonusBalance;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Crm.BonusData;

public sealed class BonusBalanceServiceClientTests
{
    [Fact]
    public void ShouldReferToCorrectData()
    {
        var target = new BonusBalanceServiceClient(Mock.Of<IGetDataServiceClient>());

        target.DataUrl.Should().Be(PosApiEndpoint.Crm.BonusBalance);
        target.CacheKey.Should().Be("BonusBalance");
    }
}
