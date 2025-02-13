using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;
using Frontend.Vanilla.ServiceClients.Services;
using Frontend.Vanilla.ServiceClients.Services.Crm.LoyaltyProfiles;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Crm.LoyaltyProfiles;

public class LoyaltyProfileServiceClientTests
{
    [Fact]
    public void ShouldReferToCorrectData()
    {
        var target = new LoyaltyProfileServiceClient(Mock.Of<IGetDataServiceClient>());

        target.DataUrl.Should().Be(PosApiEndpoint.Crm.LoyaltyProfile);
        target.CacheKey.Should().Be("LoyaltyProfile"); // Used with distributed cache -> must match between products -> don't change!!!
    }
}
