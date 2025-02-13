using System;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.ServiceClients.Services.Common.Currencies;
using Frontend.Vanilla.ServiceClients.Services.Wallet.Balances;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public class BalanceDslProviderTests
{
    private IBalanceDslProvider target;
    private Mock<IBalanceDslExecutor> executor;
    private ExecutionMode mode;

    public BalanceDslProviderTests()
    {
        executor = new Mock<IBalanceDslExecutor>();
        target = new BalanceDslProvider(executor.Object);
        mode = TestExecutionMode.Get();
    }

    [Fact]
    public async Task GetAccountBalanceAsync_Test()
        => await RunTest(() => target.GetAccountBalanceAsync(mode), expectedProperty: 1);

    [Fact]
    public async Task GetPayPalBalanceAsync_Test()
        => await RunTest(() => target.GetPayPalBalanceAsync(mode), expectedProperty: 2);

    [Fact]
    public async Task GetPayPalRestrictedBalanceAsync_Test()
        => await RunTest(() => target.GetPayPalRestrictedBalanceAsync(mode), expectedProperty: 3);

    [Fact]
    public async Task GetPayPalCashoutableBalanceAsync_Test()
        => await RunTest(() => target.GetPayPalCashoutableBalanceAsync(mode), expectedProperty: 4);

    [Fact]
    public async Task GetCashoutRestrictedBalanceAsync_Test()
        => await RunTest(() => target.GetCashoutRestrictedBalanceAsync(mode), expectedProperty: 5);

    [Fact]
    public async Task GetCashoutableBalanceAsync_Test()
        => await RunTest(() => target.GetCashoutableBalanceAsync(mode), expectedProperty: 6);

    [Fact]
    public async Task GetashoutableBalanceReal_Test()
        => await RunTest(() => target.GetCashoutableBalanceRealAsync(mode), expectedProperty: 7);

    [Fact]
    public async Task GetAvailableBalanceAsync_Test()
        => await RunTest(() => target.GetAvailableBalanceAsync(mode), expectedProperty: 8);

    [Fact]
    public async Task GetDepositRestrictedBalanceAsync_Test()
        => await RunTest(() => target.GetDepositRestrictedBalanceAsync(mode), expectedProperty: 9);

    [Fact]
    public async Task GetInPlayAmountAsync_Test()
        => await RunTest(() => target.GetInPlayAmountAsync(mode), expectedProperty: 10);

    [Fact]
    public async Task GetReleaseRestrictedBalanceAsync_Test()
        => await RunTest(() => target.GetReleaseRestrictedBalanceAsync(mode), expectedProperty: 11);

    [Fact]
    public async Task GetPlayMoneyBalanceAsync_Test()
        => await RunTest(() => target.GetPlayMoneyBalanceAsync(mode), expectedProperty: 12);

    [Fact]
    public async Task GetPlayMoneyInPlayAmountAsync_Test()
        => await RunTest(() => target.GetPlayMoneyInPlayAmountAsync(mode), expectedProperty: 13);

    [Fact]
    public async Task GetOwedAmountAsync_Test()
        => await RunTest(() => target.GetOwedAmountAsync(mode), expectedProperty: 14);

    [Fact]
    public async Task GetTaxWithheldAmountAsync_Test()
        => await RunTest(() => target.GetTaxWithheldAmountAsync(mode), expectedProperty: 15);

    [Fact]
    public async Task GetPokerWinningsRestrictedBalanceAsync_Test()
        => await RunTest(() => target.GetPokerWinningsRestrictedBalanceAsync(mode), expectedProperty: 16);

    [Fact]
    public async Task GetCashoutRestrictedCashBalanceAsync_Test()
        => await RunTest(() => target.GetCashoutRestrictedCashBalanceAsync(mode), expectedProperty: 17);

    [Fact]
    public async Task GetCashoutableBalanceAtOnlineAsync_Test()
        => await RunTest(() => target.GetCashoutableBalanceAtOnlineAsync(mode), expectedProperty: 18);

    [Fact]
    public async Task GetCashoutableBalanceAtRetailAsync_Test()
        => await RunTest(() => target.GetCashoutableBalanceAtRetailAsync(mode), expectedProperty: 19);

    [Fact]
    public async Task GetCreditCardDepositBalanceAsync_Test()
        => await RunTest(() => target.GetCreditCardDepositBalanceAsync(mode), expectedProperty: 20);

    [Fact]
    public async Task GetCreditCardWinningsBalanceAsync_Test()
        => await RunTest(() => target.GetCreditCardWinningsBalanceAsync(mode), expectedProperty: 21);

    [Fact]
    public async Task GetDebitCardDepositBalanceAsync_Test()
        => await RunTest(() => target.GetDebitCardDepositBalanceAsync(mode), expectedProperty: 22);

    [Fact]
    public async Task GetMainRealBalanceAsync_Test()
        => await RunTest(() => target.GetMainRealBalanceAsync(mode), expectedProperty: 23);

    [Fact]
    public async Task GetUncollectedFundsAsync_Test()
        => await RunTest(() => target.GetUncollectedFundsAsync(mode), expectedProperty: 24);

    [Fact]
    public async Task GetBalanceForGameTypeAsync_Test()
        => await RunTest(() => target.GetBalanceForGameTypeAsync(mode), expectedProperty: 25);

    [Fact]
    public async Task GetBonusWinningsRestrictedBalanceAsync_Test()
        => await RunTest(() => target.GetBonusWinningsRestrictedBalanceAsync(mode), expectedProperty: 26);

    [Fact]
    public async Task GetSportsExclusiveBalanceAsync_Test()
        => await RunTest(() => target.GetSportsExclusiveBalanceAsync(mode), expectedProperty: 27);

    [Fact]
    public async Task GetSportsDepositBalanceAsync_Test()
        => await RunTest(() => target.GetSportsDepositBalanceAsync(mode), expectedProperty: 28);

    [Fact]
    public async Task GetGamesDepositBalanceAsync_Test()
        => await RunTest(() => target.GetGamesDepositBalanceAsync(mode), expectedProperty: 29);

    [Fact]
    public async Task GetSportsWinningsBalanceAsync_Test()
        => await RunTest(() => target.GetSportsWinningsBalanceAsync(mode), expectedProperty: 30);

    [Fact]
    public async Task GetPokerWinningsBalanceAsync_Test()
        => await RunTest(() => target.GetPokerWinningsBalanceAsync(mode), expectedProperty: 31);

    [Fact]
    public async Task GetSlotsWinningsBalanceAsync_Test()
        => await RunTest(() => target.GetSlotsWinningsBalanceAsync(mode), expectedProperty: 32);

    [Fact]
    public async Task GetSportRestrictedBalanceAsync_Test()
        => await RunTest(() => target.GetSportsRestrictedBalanceAsync(mode), expectedProperty: 33);

    [Fact]
    public async Task GetPokerRestrictedBalanceAsync_Test()
        => await RunTest(() => target.GetPokerRestrictedBalanceAsync(mode), expectedProperty: 34);

    [Fact]
    public async Task GetSlotsRestrictedBalanceAsync_Test()
        => await RunTest(() => target.GetSlotsRestrictedBalanceAsync(mode), expectedProperty: 35);

    [Fact]
    public async Task GetAllWinningsBalanceAsync_Test()
        => await RunTest(() => target.GetAllWinningsBalanceAsync(mode), expectedProperty: 36);

    [Fact]
    public async Task GetMaxLimitExceededBalanceAsync_Test()
        => await RunTest(() => target.GetMaxLimitExceededBalanceAsync(mode), expectedProperty: 37);

    [Fact]
    public async Task GetPrepaidCardDepositBalanceAsync_Test()
        => await RunTest(() => target.GetPrepaidCardDepositBalanceAsync(mode), expectedProperty: 38);

    private async Task RunTest(Func<Task<decimal>> act, decimal expectedProperty)
    {
        var balance = new Balance(
            new Currency(),
            accountBalance: 1,
            payPalBalance: 2,
            payPalRestrictedBalance: 3,
            payPalCashoutableBalance: 4,
            cashoutRestrictedBalance: 5,
            cashoutableBalance: 6,
            cashoutableBalanceReal: 7,
            availableBalance: 8,
            depositRestrictedBalance: 9,
            inPlayAmount: 10,
            releaseRestrictedBalance: 11,
            playMoneyBalance: 12,
            playMoneyInPlayAmount: 13,
            owedAmount: 14,
            taxWithheldAmount: 15,
            pokerWinningsRestrictedBalance: 16,
            cashoutRestrictedCashBalance: 17,
            cashoutableBalanceAtOnline: 18,
            cashoutableBalanceAtRetail: 19,
            creditCardDepositBalance: 20,
            creditCardWinningsBalance: 21,
            debitCardDepositBalance: 22,
            mainRealBalance: 23,
            uncollectedFunds: 24,
            balanceForGameType: 25,
            bonusWinningsRestrictedBalance: 26,
            sportsExclusiveBalance: 27,
            sportsDepositBalance: 28,
            gamesDepositBalance: 29,
            sportsWinningsBalance: 30,
            pokerWinningsBalance: 31,
            slotsWinningsBalance: 32,
            sportsRestrictedBalance: 33,
            pokerRestrictedBalance: 34,
            slotsRestrictedBalance: 35,
            allWinningsBalance: 36,
            maxLimitExceededBalance: 37,
            prepaidCardDepositBalance: 38);

        executor.Setup(e => e.GetAsync(mode, It.IsAny<Func<Balance, decimal>>())).ReturnsAsync(666);

        var result = await act();

        result.Should().Be(666);
        var getProperty = (Func<Balance, decimal>)executor.Invocations.Single().Arguments[1];
        getProperty(balance).Should().Be(expectedProperty);
    }
}
