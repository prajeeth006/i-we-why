#nullable enable

using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Common.Currencies;
using Frontend.Vanilla.ServiceClients.Services.Wallet.Balances;
using Newtonsoft.Json;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Wallet.Balances;

public class BalanceTests
{
    [Fact]
    public void ShouldSerializeForDistributedCache()
    {
        var target = new Balance(new Currency(), accountBalance: 666);

        // Act
        var json = JsonConvert.SerializeObject(target);
        var deserialized = JsonConvert.DeserializeObject<Balance>(json);

        deserialized.Should().BeEquivalentTo(target);
    }

    [Fact]
    public void ShouldCreateFromPosApiDto()
    {
        var dto = new BalancePosApiDto
        {
            AccountBalance = 1,
            BalanceForGameType = 2,
            BonusWinningsRestrictedBalance = 3,
            CashoutRestrictedBalance = 4,
            CashoutableBalance = 5,
            CashoutableBalanceAtOnline = 6,
            CashoutableBalanceAtRetail = 7,
            CreditCardDepositBalance = 8,
            CreditCardWinningsBalance = 9,
            DebitCardDepositBalance = 10,
            MainRealBalance = 11,
            UncollectedFunds = 12,
            CashoutableBalanceReal = 13,
            AvailableBalance = 14,
            DepositRestrictedBalance = 15,
            InPlayAmount = 16,
            ReleaseRestrictedBalance = 17,
            PlayMoneyBalance = 18,
            PlayMoneyInPlayAmount = 19,
            OwedAmount = 20,
            TaxWithheldAmount = 21,
            PokerWinningsRestrictedBalance = 22,
            CashoutRestrictedCashBalance = 23,
            PayPalBalance = 24,
            PayPalRestrictedBalance = 25,
            PayPalCashoutableBalance = 26,
            SportsRestrictedBalance = 27,
            PokerRestrictedBalance = 28,
            SlotsRestrictedBalance = 29,
            MaxLimitExceededBalance = 30,
        };
        var currency = new Currency("gold");

        // Act
        var target = Balance.Create(dto, currency);

        target.Should().BeEquivalentTo(new Balance(
            accountBalance: 1,
            accountCurrency: currency,
            balanceForGameType: 2,
            bonusWinningsRestrictedBalance: 3,
            cashoutRestrictedBalance: 4,
            cashoutableBalance: 5,
            cashoutableBalanceAtOnline: 6,
            cashoutableBalanceAtRetail: 7,
            creditCardDepositBalance: 8,
            creditCardWinningsBalance: 9,
            debitCardDepositBalance: 10,
            mainRealBalance: 11,
            uncollectedFunds: 12,
            cashoutableBalanceReal: 13,
            availableBalance: 14,
            depositRestrictedBalance: 15,
            inPlayAmount: 16,
            releaseRestrictedBalance: 17,
            playMoneyBalance: 18,
            playMoneyInPlayAmount: 19,
            owedAmount: 20,
            taxWithheldAmount: 21,
            pokerWinningsRestrictedBalance: 22,
            cashoutRestrictedCashBalance: 23,
            payPalBalance: 24,
            payPalRestrictedBalance: 25,
            payPalCashoutableBalance: 26,
            sportsRestrictedBalance: 27,
            pokerRestrictedBalance: 28,
            slotsRestrictedBalance: 29,
            maxLimitExceededBalance: 30));
    }

    [Fact]
    public void ShouldCreateFromCachedDtos()
    {
        var currency = new Currency("gold");
        var crossProduct = new CrossProductBalanceCachedDto(
            accountCurrency: currency,
            accountBalance: 1,
            bonusWinningsRestrictedBalance: 2,
            cashoutableBalance: 3,
            cashoutableBalanceAtOnline: 4,
            cashoutableBalanceAtRetail: 5,
            creditCardDepositBalance: 6,
            creditCardWinningsBalance: 7,
            debitCardDepositBalance: 8,
            mainRealBalance: 9,
            uncollectedFunds: 10,
            cashoutableBalanceReal: 11,
            availableBalance: 12,
            depositRestrictedBalance: 13,
            inPlayAmount: 14,
            releaseRestrictedBalance: 15,
            playMoneyBalance: 16,
            playMoneyInPlayAmount: 17,
            owedAmount: 18,
            taxWithheldAmount: 19,
            pokerWinningsRestrictedBalance: 20,
            cashoutRestrictedCashBalance: 21,
            payPalCashoutableBalance: 22,
            sportsExclusiveBalance: 10,
            sportsDepositBalance: 11,
            gamesDepositBalance: 12,
            sportsWinningsBalance: 13,
            pokerWinningsBalance: 14,
            slotsWinningsBalance: 15,
            allWinningsBalance: 16,
            pokerRestrictedBalance: 17,
            slotsRestrictedBalance: 18,
            sportsRestrictedBalance: 19,
            maxLimitExceededBalance: 30,
            prepaidCardDepositBalance: 27);
        var productSpecific = new ProductSpecificBalanceCachedDto(
            balanceForGameType: 101,
            cashoutRestrictedBalance: 102,
            payPalBalance: 103,
            payPalRestrictedBalance: 104);

        // Act
        var target = Balance.Create(crossProduct, productSpecific);

        target.Should().BeEquivalentTo(new Balance(
            accountCurrency: currency,
            accountBalance: 1,
            bonusWinningsRestrictedBalance: 2,
            cashoutableBalance: 3,
            cashoutableBalanceAtOnline: 4,
            cashoutableBalanceAtRetail: 5,
            creditCardDepositBalance: 6,
            creditCardWinningsBalance: 7,
            debitCardDepositBalance: 8,
            mainRealBalance: 9,
            uncollectedFunds: 10,
            cashoutableBalanceReal: 11,
            availableBalance: 12,
            depositRestrictedBalance: 13,
            inPlayAmount: 14,
            releaseRestrictedBalance: 15,
            playMoneyBalance: 16,
            playMoneyInPlayAmount: 17,
            owedAmount: 18,
            taxWithheldAmount: 19,
            pokerWinningsRestrictedBalance: 20,
            cashoutRestrictedCashBalance: 21,
            payPalCashoutableBalance: 22,
            balanceForGameType: 101,
            cashoutRestrictedBalance: 102,
            payPalBalance: 103,
            payPalRestrictedBalance: 104,
            sportsExclusiveBalance: 10,
            sportsDepositBalance: 11,
            gamesDepositBalance: 12,
            sportsWinningsBalance: 13,
            pokerWinningsBalance: 14,
            slotsWinningsBalance: 15,
            allWinningsBalance: 16,
            pokerRestrictedBalance: 17,
            slotsRestrictedBalance: 18,
            sportsRestrictedBalance: 19,
            maxLimitExceededBalance: 30,
            prepaidCardDepositBalance: 27));
    }
}
