using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Features.UserBalance;
using Frontend.Vanilla.Testing.AbstractTests;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.UserBalance;

public class BalanceSettingsConfigProviderTests : ClientConfigProviderTestsBase
{
    private readonly BalanceConfiguration balanceConfig;

    public BalanceSettingsConfigProviderTests()
    {
        balanceConfig = new BalanceConfiguration();
        Target = new BalanceSettingsConfigProvider(balanceConfig);
    }

    [Fact]
    public async Task ShouldReturnBalanceConfig()
    {
        var config = await Target.GetClientConfigAsync(Ct);

        config.Should().BeSameAs(balanceConfig);
    }
}
