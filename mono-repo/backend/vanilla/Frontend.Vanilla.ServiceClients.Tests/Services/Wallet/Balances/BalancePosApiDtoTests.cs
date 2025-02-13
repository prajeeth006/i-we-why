#nullable enable

using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Wallet.Balances;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Wallet.Balances;

public class BalancePosApiDtoTests
{
    [Fact]
    public void CanBeDeserialized()
    {
        const string json = @"{
                ""accountCurrency"": ""USD"",
                ""accountBalance"": 1.01,
                ""balanceForGameType"": 1.02,
                ""bonusWinningsRestrictedBalance"": 1.03,
                ""cashoutRestrictedBalance"": 1.04,
                ""cashoutableBalance"": 1.05,
                ""cashoutableBalanceReal"": 1.06,
                ""availableBalance"": 1.07,
                ""depositRestrictedBalance"": 1.08,
                ""inPlayAmount"": 1.09,
                ""releaseRestrictedBalance"": 1.10,
                ""playMoneyBalance"": 1.11,
                ""playMoneyInPlayAmount"": 1.12,
                ""owedAmount"": 1.13,
                ""taxWithheldAmount"": 1.14,
                ""pokerWinningsRestrictedBalance"": 1.15,
                ""cashoutRestrictedCashBalance"": 1.16,
                ""cashoutableBalanceAtOnline"": 1.17,
                ""cashoutableBalanceAtRetail"": 1.18,
                ""creditCardDepositBalance"": 1.19,
                ""creditCardWinningsBalance"": 1.20,
                ""debitCardDepositBalance"": 1.21,
                ""mainRealBalance"": 1.22,
                ""uncollectedFunds"": 1.23,
                ""paypalBalance"": 1.24,
                ""paypalRestrictedBalance"": 1.25,
                ""paypalCashoutableBalance"": 1.26
            }";

        var target = PosApiSerializationTester.Deserialize<BalancePosApiDto>(json); // Act

        target.AccountBalance.Should().Be(1.01m);
        target.AccountCurrency.Should().Be("USD");
        target.BalanceForGameType.Should().Be(1.02m);
        target.BonusWinningsRestrictedBalance.Should().Be(1.03m);
        target.CashoutRestrictedBalance.Should().Be(1.04m);
        target.CashoutableBalance.Should().Be(1.05m);
        target.CashoutableBalanceReal.Should().Be(1.06m);
        target.AvailableBalance.Should().Be(1.07m);
        target.DepositRestrictedBalance.Should().Be(1.08m);
        target.InPlayAmount.Should().Be(1.09m);
        target.ReleaseRestrictedBalance.Should().Be(1.10m);
        target.PlayMoneyBalance.Should().Be(1.11m);
        target.PlayMoneyInPlayAmount.Should().Be(1.12m);
        target.OwedAmount.Should().Be(1.13m);
        target.TaxWithheldAmount.Should().Be(1.14m);
        target.PokerWinningsRestrictedBalance.Should().Be(1.15m);
        target.CashoutRestrictedCashBalance.Should().Be(1.16m);
        target.CashoutableBalanceAtOnline.Should().Be(1.17m);
        target.CashoutableBalanceAtRetail.Should().Be(1.18m);
        target.CreditCardDepositBalance.Should().Be(1.19m);
        target.CreditCardWinningsBalance.Should().Be(1.20m);
        target.DebitCardDepositBalance.Should().Be(1.21m);
        target.MainRealBalance.Should().Be(1.22m);
        target.UncollectedFunds.Should().Be(1.23m);
        target.PayPalBalance.Should().Be(1.24m);
        target.PayPalRestrictedBalance.Should().Be(1.25m);
        target.PayPalCashoutableBalance.Should().Be(1.26m);
    }
}
