using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Account.CashierStatuses;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Account.CashierStatuses;

public class CashierStatusTests
{
    [Fact]
    public void CanBeDeserialized()
    {
        var target = PosApiSerializationTester.Deserialize<CashierStatusDto>(@"{
                ""isDepositSuppressed"": true
            }").GetData();

        target.IsDepositSuppressed.Should().BeTrue();
    }
}
