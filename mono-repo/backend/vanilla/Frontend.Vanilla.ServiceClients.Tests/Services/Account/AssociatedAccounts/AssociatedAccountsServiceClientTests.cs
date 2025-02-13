using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;
using Frontend.Vanilla.ServiceClients.Services;
using Frontend.Vanilla.ServiceClients.Services.Account.AssociatedAccounts;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Account.AssociatedAccounts;

public sealed class AssociatedAccountsServiceClientTests
{
    [Fact]
    public void ShouldReferToCorrectData()
    {
        var target = new AssociatedAccountsServiceClient(Mock.Of<IGetDataServiceClient>());

        target.DataUrl.Should().Be(PosApiEndpoint.Account.AssociatedAccounts);
        target.CacheKey.Should().Be("AssociatedAccounts"); // Used with distributed cache -> must match between products -> don't change!!!
    }
}
