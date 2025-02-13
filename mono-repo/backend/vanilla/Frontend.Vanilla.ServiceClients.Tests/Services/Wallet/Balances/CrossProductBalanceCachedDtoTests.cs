#nullable enable

using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Common.Currencies;
using Frontend.Vanilla.ServiceClients.Services.Wallet.Balances;
using Newtonsoft.Json;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Wallet.Balances;

public class CrossProductBalanceCachedDtoTests
{
    [Fact]
    public void ShouldSerializeForDistributedCache()
    {
        var target = new CrossProductBalanceCachedDto(
            0,
            new Currency("GOLD"),
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
            21,
            10,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
            21,
            22);

        // Act
        var json = JsonConvert.SerializeObject(target);
        var deserialized = JsonConvert.DeserializeObject<Balance>(json);

        deserialized.Should().BeEquivalentTo(target);
    }

    [Fact]
    public void ShouldCreateFromBalance()
    {
        var currency = new Currency("gold");
        var balance = new Balance(
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
            sportsDepositBalance: 12,
            gamesDepositBalance: 13,
            sportsWinningsBalance: 14,
            pokerWinningsBalance: 15,
            slotsWinningsBalance: 16,
            allWinningsBalance: 17,
            sportsRestrictedBalance: 18,
            pokerRestrictedBalance: 19,
            slotsRestrictedBalance: 20,
            maxLimitExceededBalance: 30,
            prepaidCardDepositBalance: 27);

        // Act
        var target = CrossProductBalanceCachedDto.Create(balance);

        target.Should().BeEquivalentTo(new CrossProductBalanceCachedDto(
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
            sportsDepositBalance: 12,
            gamesDepositBalance: 13,
            sportsWinningsBalance: 14,
            pokerWinningsBalance: 15,
            slotsWinningsBalance: 16,
            sportsRestrictedBalance: 18,
            pokerRestrictedBalance: 19,
            slotsRestrictedBalance: 20,
            allWinningsBalance: 17,
            maxLimitExceededBalance: 30,
            prepaidCardDepositBalance: 27));
    }
}
