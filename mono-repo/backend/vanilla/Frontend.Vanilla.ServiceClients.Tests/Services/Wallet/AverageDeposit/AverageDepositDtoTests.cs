using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Wallet.AverageDeposit;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Wallet.AverageDeposit;

public sealed class AverageDepositDtoTests
{
    [Fact]
    public void CanBeDeserialized()
    {
        const string json = @"{
                ""labelAverageDepositAmount"": 45.7,
                ""userAverageDepositAmount"": 89.0}";

        var target = PosApiSerializationTester.Deserialize<AverageDepositDto>(json); // Act

        target.Should().BeEquivalentTo(new AverageDepositDto(45.7M, 89M));
    }
}
