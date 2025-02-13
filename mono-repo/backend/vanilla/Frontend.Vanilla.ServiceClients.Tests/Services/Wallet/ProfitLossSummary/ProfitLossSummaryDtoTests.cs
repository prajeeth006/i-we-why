using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Wallet.ProfitLossSummary;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Wallet.ProfitLossSummary;

public sealed class ProfitLossSummaryDtoTests
{
    [Fact]
    public void CanBeDeserialized()
    {
        const string json = @"{
                ""totalReturn"": 45.7,
                ""totalStake"": 89.0}";

        var target = PosApiSerializationTester.Deserialize<ProfitLossSummaryDto>(json); // Act

        target.Should().BeEquivalentTo(new ProfitLossSummaryDto(45.7M, 89M));
    }
}
