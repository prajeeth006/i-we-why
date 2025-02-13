using System.Security.Claims;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Wallet;
using Frontend.Vanilla.ServiceClients.Services.Wallet.PlayerActivitySummary;
using Frontend.Vanilla.ServiceClients.Services.Wallet.TransactionHistory;
using Frontend.Vanilla.ServiceClients.Services.Wallet.UserTransactionSummary;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public class UserSummaryDslProviderTests
{
    private readonly IUserSummaryDslProvider target;
    private readonly Mock<ICurrentUserAccessor> currentUserAccessorMock;
    private readonly Mock<IPosApiWalletServiceInternal> posApiWalletServiceMock;

    private readonly ClaimsPrincipal user;
    private readonly ExecutionMode mode;

    public UserSummaryDslProviderTests()
    {
        currentUserAccessorMock = new Mock<ICurrentUserAccessor>();
        posApiWalletServiceMock = new Mock<IPosApiWalletServiceInternal>();

        target = new UserSummaryDslProvider(currentUserAccessorMock.Object, posApiWalletServiceMock.Object);

        user = TestUser.Get(AuthState.Authenticated);
        mode = TestExecutionMode.Get();

        currentUserAccessorMock.SetupGet(c => c.User).Returns(() => user);
    }

    [Fact]
    public async Task GetNetProfitAsync_Test()
    {
        posApiWalletServiceMock.Setup(m => m.GetPlayerActivitySummaryAsync(mode, It.IsAny<bool>()))
            .ReturnsAsync(new ActivitySummary(netProfit: 1));

        var result = await target.GetNetProfitAsync(mode);

        result.Should().Be(1);
    }

    [Fact]
    public async Task GetNetLossAsync_Test()
    {
        posApiWalletServiceMock.Setup(m => m.GetPlayerActivitySummaryAsync(mode, It.IsAny<bool>()))
            .ReturnsAsync(new ActivitySummary(netLoss: 1));

        var result = await target.GetNetLossAsync(mode);

        result.Should().Be(1);
    }

    [Fact]
    public async Task GetPokerTaxCollectedAsync_Test()
    {
        posApiWalletServiceMock.Setup(m => m.GetPlayerActivitySummaryAsync(mode, It.IsAny<bool>()))
            .ReturnsAsync(new ActivitySummary(pokerTaxCollected: 1));

        var result = await target.GetPokerTaxCollectedAsync(mode);

        result.Should().Be(1);
    }

    [Fact]
    public async Task GetCasinoTaxCollectedAsync_Test()
    {
        posApiWalletServiceMock.Setup(m => m.GetPlayerActivitySummaryAsync(mode, It.IsAny<bool>()))
            .ReturnsAsync(new ActivitySummary(casinoTaxCollected: 1));

        var result = await target.GetCasinoTaxCollectedAsync(mode);

        result.Should().Be(1);
    }

    [Fact]
    public async Task GetSportsTaxCollectedAsync_Test()
    {
        posApiWalletServiceMock.Setup(m => m.GetPlayerActivitySummaryAsync(mode, It.IsAny<bool>()))
            .ReturnsAsync(new ActivitySummary(sportsTaxCollected: 12));

        var result = await target.GetSportsTaxCollectedAsync(mode);

        result.Should().Be(12);
    }

    [Fact]
    public async Task GetTotalDepositAmountAsync_Test()
    {
        posApiWalletServiceMock.Setup(m => m.GetUserTransactionSummaryAsync(mode, It.IsAny<bool>()))
            .ReturnsAsync(new TransactionSummary(totalDepositamount: 1));

        var result = await target.GetTotalDepositAmountAsync(mode);

        result.Should().Be(1);
    }

    [Fact]
    public async Task GetTotalWithdrawalAmountAsync_Test()
    {
        posApiWalletServiceMock.Setup(m => m.GetUserTransactionSummaryAsync(mode, It.IsAny<bool>()))
            .ReturnsAsync(new TransactionSummary(totalWithdrawalamount: 1));

        var result = await target.GetTotalWithdrawalAmountAsync(mode);

        result.Should().Be(1);
    }

    [Fact]
    public async Task GetLossAsync_Test()
    {
        posApiWalletServiceMock.Setup(m => m.GetTransactionHistoryAsync(mode, It.IsAny<bool>()))
            .ReturnsAsync(new Transactions(loss: 1));

        var result = await target.GetLossAsync(mode);

        result.Should().Be(1);
    }

    [Fact]
    public async Task GetProfitAsync_Test()
    {
        posApiWalletServiceMock.Setup(m => m.GetTransactionHistoryAsync(mode, It.IsAny<bool>()))
            .ReturnsAsync(new Transactions(profit: 1));

        var result = await target.GetProfitAsync(mode);

        result.Should().Be(1);
    }
}
