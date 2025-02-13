using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;
using Frontend.Vanilla.ServiceClients.Services;
using Frontend.Vanilla.ServiceClients.Services.Crm.LoyaltyProfiles;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Crm.LoyaltyProfiles;

public class BasicLoyaltyProfileServiceClientTests
{
    [Fact]
    public void ShouldReferToCorrectData()
    {
        var target = new BasicLoyaltyProfileServiceClient(Mock.Of<IGetDataServiceClient>());

        target.DataUrl.Should().Be(PosApiEndpoint.Crm.BasicLoyaltyProfile);
        target.CacheKey.Should().Be("BasicLoyaltyProfile"); // Used with distributed cache -> must match between products -> don't change!!!
    }
}
