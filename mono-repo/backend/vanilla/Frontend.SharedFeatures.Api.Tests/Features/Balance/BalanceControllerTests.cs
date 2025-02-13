using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.Balance;
using Frontend.Vanilla.Features.Json.ActionResults;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Common.Currencies;
using Frontend.Vanilla.ServiceClients.Services.Crm;
using Frontend.Vanilla.ServiceClients.Services.Crm.BonusBalance;
using Frontend.Vanilla.ServiceClients.Services.Wallet;
using Frontend.Vanilla.ServiceClients.Services.Wallet.Balances;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.Balance;

public class BalanceControllerTests
{
    private readonly Mock<IPosApiWalletServiceInternal> walletServiceMock;
    private readonly Mock<IPosApiCrmServiceInternal> crmService;
    private readonly TestLogger<BalanceController> log;
    private readonly CancellationToken ct;

    public BalanceControllerTests()
    {
        ct = TestCancellationToken.Get();
        log = new TestLogger<BalanceController>();
        walletServiceMock = new Mock<IPosApiWalletServiceInternal>();
        crmService = new Mock<IPosApiCrmServiceInternal>();

        walletServiceMock.Setup(x => x.GetBalanceAsync(ct, It.IsAny<bool>()))
            .Returns(Task.FromResult(new Vanilla.ServiceClients.Services.Wallet.Balances.Balance(new Currency())));
        walletServiceMock.Setup(x => x.TransferBalanceAsync(It.IsAny<TransferBalance>(), ct))
            .Returns(Task.FromResult(true));
    }

    [Fact]
    public async Task Refresh_ShouldReturnBalanceResult()
    {
        var controller = new BalanceController(walletServiceMock.Object, crmService.Object, log);

        var result = (OkObjectResult)await controller.Get(ct);

        walletServiceMock.Verify(s => s.GetBalanceAsync(ct, It.IsAny<bool>()), Times.Once);

        result.Value.Should().BeEquivalentTo(new { balance = new Vanilla.ServiceClients.Services.Wallet.Balances.Balance(new Currency()) });
    }

    [Fact]
    public async Task Refresh_ShouldReturnTechnicalError_OnPosApiException()
    {
        // Setup
        var controller = new BalanceController(walletServiceMock.Object, crmService.Object, log);
        var exception = new PosApiException(message: "error", posApiCode: 500);
        walletServiceMock.Setup(s => s.GetBalanceAsync(ct, It.IsAny<bool>())).ThrowsAsync(exception);

        // Act
        var result = await controller.Get(ct);

        // Assert
        result.Should().BeOfType<TechnicalErrorMessageResult>();
        log.Logged.Single().Verify(LogLevel.Error, exception);
    }

    [Fact]
    public async Task Refresh_ShouldReturnTechnicalError_OnGeneralException()
    {
        // Setup
        var controller = new BalanceController(walletServiceMock.Object, crmService.Object, log);
        var exception = new Exception(message: "error");
        walletServiceMock.Setup(s => s.GetBalanceAsync(ct, It.IsAny<bool>())).ThrowsAsync(exception);

        // Act
        var result = await controller.Get(ct);

        // Assert
        result.Should().BeOfType<TechnicalErrorMessageResult>();
        log.Logged.Single().Verify(LogLevel.Error, exception);
    }

    [Fact]
    public async Task Transfer_ShouldCallPosApiMethod()
    {
        var controller = new BalanceController(walletServiceMock.Object, crmService.Object, log);
        var transfer = new TransferBalance() { Amount = 10, FromBalanceType = "from", ToBalanceType = "to" };

        await controller.Transfer(transfer, ct);

        walletServiceMock.Verify(s => s.TransferBalanceAsync(transfer, ct), Times.Once);
    }

    [Fact]
    public async Task Bonus_ShouldReturnBonusBalance()
    {
        var controller = new BalanceController(walletServiceMock.Object, crmService.Object, log);
        var bonusBalance = new Dictionary<string, ProductBonusInfo>
        {
            ["CASINO"] = new ProductBonusInfo(new List<Vanilla.ServiceClients.Services.Crm.BonusBalance.Bonus>
                { new Vanilla.ServiceClients.Services.Crm.BonusBalance.Bonus(10, true, new List<string> { "CASINO" }) }),
        };

        crmService.Setup(c => c.GetBonusBalanceAsync(ct, false)).ReturnsAsync(bonusBalance);

        var result = (OkObjectResult)await controller.BonusBalance(ct);
        var response = (IReadOnlyDictionary<string, ProductBonusInfo>)result.Value!;
        response.Should().BeSameAs(bonusBalance);
    }
}
