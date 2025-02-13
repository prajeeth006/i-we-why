using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Wallet.UserTransactionSummary;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Wallet.UserTransactionSummary;

public class UserTransactionSummaryServiceClientTests : WalletServiceClientTestsBase
{
    private IUserTransactionSummaryServiceClient target;

    protected override void Setup()
    {
        base.Setup();

        PosApiRestClientMock.Setup(s => s.ExecuteAsync<TransactionSummaryDto>(TestMode, It.IsAny<PosApiRestRequest>()))
            .ReturnsAsync(new TransactionSummaryDto());

        target = new UserTransactionSummaryServiceClient(PosApiRestClientMock.Object, Cache.Object, RequestSemaphoresMock.Object);
    }

    [Theory, BooleanData]
    public async Task GetAsync_ShouldExecuteCorrectly(bool cached)
    {
        // Act
        var result = await target.GetAsync(TestMode, cached);

        // Assert
        VerifyGetAsync<TransactionSummaryDto>(cached, "UserTransactionSummary");
        VerifyTransactionSummary(result);
    }

    private static void VerifyTransactionSummary(TransactionSummary result)
    {
        result.AccountCurrency.Should().Be(string.Empty);
        result.TotalDepositamount.Should().Be(0);
        result.TotalWithdrawalamount.Should().Be(0);
    }
}
