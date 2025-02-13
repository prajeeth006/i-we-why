using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Wallet.CustomerNetDeposit;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Wallet.CustomerNetDeposit;

public sealed class CustomerNetDepositTests
{
    [Fact]
    public void CanBeDeserialized()
    {
        const string json = @"{""customerNetDepositAmounts"": [
            {
                ""amount"": 54.4,
            },
            {
                ""amount"": 133,
            },
            {
                ""amount"": -103,
            }]}";

        var target = PosApiSerializationTester.Deserialize<CustomerNetDepositDto>(json); // Act

        target.CustomerNetDepositAmounts.Count.Should().Be(3);
        target.CustomerNetDepositAmounts.Should().BeEquivalentTo(new List<CustomerNetDepositAmount>
        {
            new ()
            {
                Amount = 54.4M,
            },
            new ()
            {
                Amount = 133,
            },
            new ()
            {
                Amount = -103,
            },
        });
    }
}
