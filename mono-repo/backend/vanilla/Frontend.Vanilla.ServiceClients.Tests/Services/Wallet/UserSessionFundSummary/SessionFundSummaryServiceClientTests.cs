using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Wallet.UserSessionFundSummary;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Wallet.UserSessionFundSummary;

public class SessionFundSummaryServiceClientTests : WalletServiceClientTestsBase
{
    private ISessionFundSummaryServiceClient target;

    protected override void Setup()
    {
        base.Setup();

        PosApiRestClientMock.Setup(s => s.ExecuteAsync<SessionFundSummaryDto>(TestMode, It.IsAny<PosApiRestRequest>()))
            .ReturnsAsync(new SessionFundSummaryDto());

        target = new SessionFundSummaryServiceClient(PosApiRestClientMock.Object, Cache.Object, RequestSemaphoresMock.Object);
    }

    [Theory, BooleanData]
    public async Task GetAsync_ShouldExecuteCorrectly(bool cached)
    {
        // Act
        var result = await target.GetAsync(TestMode, cached);

        // Assert
        VerifyGetAsync<SessionFundSummaryDto>(cached, "SessionFundSummary");
        VerifyTransactionSummary(result);
    }

    private static void VerifyTransactionSummary(SessionFundSummary result)
    {
        result.InitialBalance.Should().Be(0);
        result.CurrentBalance.Should().Be(0);
        result.Profit.Should().Be(0);
        result.Loss.Should().Be(0);
        result.TotalStake.Should().Be(0);
    }
}
