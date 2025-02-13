#nullable enable

using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Common.Currencies;
using Frontend.Vanilla.ServiceClients.Services.Wallet.Balances;
using Newtonsoft.Json;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Wallet.Balances;

public class ProductSpecificBalanceCachedDtoTests
{
    [Fact]
    public void ShouldSerializeForDistributedCache()
    {
        var target = new ProductSpecificBalanceCachedDto(0, 1, 2, 3);

        // Act
        var json = JsonConvert.SerializeObject(target);
        var deserialized = JsonConvert.DeserializeObject<ProductSpecificBalanceCachedDto>(json);

        deserialized.Should().BeEquivalentTo(target);
    }

    [Fact]
    public void ShouldCreateFromBalance()
    {
        var balance = new Balance(
            new Currency(),
            balanceForGameType: 1,
            cashoutRestrictedBalance: 2,
            payPalBalance: 3,
            payPalRestrictedBalance: 4);

        // Act
        var target = ProductSpecificBalanceCachedDto.Create(balance);

        target.Should().BeEquivalentTo(new ProductSpecificBalanceCachedDto(
            balanceForGameType: 1,
            cashoutRestrictedBalance: 2,
            payPalBalance: 3,
            payPalRestrictedBalance: 4));
    }
}
