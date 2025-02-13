using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;
using Frontend.Vanilla.ServiceClients.Services;
using Frontend.Vanilla.ServiceClients.Services.Crm.ReferredFriends;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Crm.ReferredFriends;

public class ReferredFriendsServiceClientTests
{
    [Fact]
    public void ShouldReferToCorrectData()
    {
        var target = new ReferredFriendsServiceClient(Mock.Of<IGetDataServiceClient>());

        target.DataUrl.Should().Be(PosApiEndpoint.Crm.ReferredFriends);
        target.CacheKey.Should().Be("ReferredFriends");
    }
}
