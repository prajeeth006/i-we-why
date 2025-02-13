using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;
using Frontend.Vanilla.ServiceClients.Services;
using Frontend.Vanilla.ServiceClients.Services.Crm.UserFlags;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Crm.UserFlags;

public class UserFlagsServiceClientTests
{
    [Fact]
    public void ShouldReferToCorrectData()
    {
        var target = new UserFlagsServiceClient(Mock.Of<IGetDataServiceClient>());

        target.DataUrl.Should().Be(PosApiEndpoint.Crm.PlayerFlags);
        target.CacheKey.Should().Be("PlayerFlags");
    }
}
