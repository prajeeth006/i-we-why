using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Wallet.NetLossInfo;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Wallet.NetLossInfo;

public sealed class NetLossInfoTests
{
    [Fact]
    public void CanBeDeserialized()
    {
        const string json = @"{
                ""netDeposit"": 45.7,
                ""netLoss"": 34.7,
                ""netWithdrawal"": 89.0}";

        var target = PosApiSerializationTester.Deserialize<NetLossInfoDto>(json); // Act

        target.Should().BeEquivalentTo(new NetLossInfoDto(34.7M, 45.7M, 89M));
    }
}
