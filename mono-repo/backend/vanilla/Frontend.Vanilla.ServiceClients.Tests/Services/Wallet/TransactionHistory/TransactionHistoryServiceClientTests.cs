using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Wallet.TransactionHistory;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Wallet.TransactionHistory;

public class TransactionHistoryServiceClientTests : WalletServiceClientTestsBase
{
    private ITransactionHistoryServiceClient target;

    protected override void Setup()
    {
        base.Setup();

        PosApiRestClientMock.Setup(s => s.ExecuteAsync<TransactionsDto>(TestMode, It.IsAny<PosApiRestRequest>()))
            .ReturnsAsync(new TransactionsDto());

        target = new TransactionHistoryServiceClient(PosApiRestClientMock.Object, Cache.Object, RequestSemaphoresMock.Object);
    }

    [Theory, BooleanData]
    public async Task GetAsync_ShouldExecuteCorrectly(bool cached)
    {
        // Act
        var result = await target.GetAsync(TestMode, cached);

        // Assert
        VerifyGetAsync<TransactionsDto>(cached, "TransactionHistory");
        VerifyTransactionHistory(result);
    }

    private static void VerifyTransactionHistory(Transactions result)
    {
        result.Currency.Should().Be(string.Empty);
        result.Loss.Should().Be(0);
        result.Profit.Should().Be(0);
        result.NetPosition.Should().Be(0);
        result.TotalCount.Should().Be(0);
        result.UserTransactions.Should().BeEmpty();
    }
}
