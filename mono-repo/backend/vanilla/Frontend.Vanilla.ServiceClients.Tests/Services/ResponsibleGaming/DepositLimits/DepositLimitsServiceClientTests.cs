using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.DepositLimits;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.ResponsibleGaming.DepositLimits;

public sealed class DepositLimitsServiceClientTests
{
    [Fact]
    public void ShouldReferToCorrectData()
    {
        var target = new DepositLimitsServiceClient(Mock.Of<IGetDataServiceClient>());

        target.DataUrl.ToString().Should().Be("ResponsibleGaming.svc/Limits/Deposit/v2");
        target.CacheKey.Should().Be("LimitsDepositV2"); // Used with distributed cache -> must match between products -> don't change!!!
    }
}
