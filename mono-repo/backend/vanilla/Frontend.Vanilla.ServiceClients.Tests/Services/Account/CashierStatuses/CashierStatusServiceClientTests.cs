using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;
using Frontend.Vanilla.ServiceClients.Services;
using Frontend.Vanilla.ServiceClients.Services.Account.CashierStatuses;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Account.CashierStatuses;

public class CashierStatusServiceClientTests
{
    [Fact]
    public void ShouldCallCorrectUrl()
    {
        var target = new CashierStatusServiceClient(Mock.Of<IGetDataServiceClient>());
        target.DataUrl.Should().Be(PosApiEndpoint.Account.CashierStatus);
    }
}
