using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;
using Frontend.Vanilla.ServiceClients.Services;
using Frontend.Vanilla.ServiceClients.Services.Account.ConnectedAccounts;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Account.ConnectedAccounts;

public sealed class ConnectedAccountsServiceClientTests
{
    [Fact]
    public void ShouldReferToCorrectData()
    {
        var target = new ConnectedAccountsServiceClient(Mock.Of<IGetDataServiceClient>());

        target.DataUrl.Should().Be(PosApiEndpoint.Account.DeUnregisteredBrandsV2);
        target.CacheKey.Should().Be("De-UnregisteredBrandsV2");
    }
}
