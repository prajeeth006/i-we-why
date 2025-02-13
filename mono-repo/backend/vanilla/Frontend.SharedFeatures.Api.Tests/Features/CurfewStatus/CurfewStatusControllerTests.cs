using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.CurfewStatus;
using Frontend.Vanilla.Features.Json.ActionResults;
using Frontend.Vanilla.ServiceClients.Services.Wallet;
using Frontend.Vanilla.ServiceClients.Services.Wallet.GetCurfewStatus;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.CurfewStatus;

public class CurfewStatusControllerTests
{
    private readonly CurfewStatusController target;
    private readonly Mock<IPosApiWalletServiceInternal> walletService;
    private readonly TestLogger<CurfewStatusController> log;
    private readonly CancellationToken ct;
    private readonly GetCurfewStatusDto curfewStatusDto;

    public CurfewStatusControllerTests()
    {
        walletService = new Mock<IPosApiWalletServiceInternal>();
        log = new TestLogger<CurfewStatusController>();
        ct = TestCancellationToken.Get();

        target = new CurfewStatusController(walletService.Object, log);

        curfewStatusDto = new GetCurfewStatusDto { IsDepositCurfewOn = true };

        walletService.Setup(s => s.GetCurfewStatusAsync(ct, It.IsAny<bool>())).ReturnsAsync(curfewStatusDto);
    }

    [Fact]
    public async Task Get_ShouldReturnCorrectValue()
    {
        // Act
        var result = (OkObjectResult)await target.Get(ct);

        // Asset
        result.Value.Should().BeEquivalentTo(new { curfewStatus = curfewStatusDto });
    }

    [Fact]
    public async Task Get_ShouldReturnTechnicalError_OnGeneralException()
    {
        // Setup
        var exception = new Exception(message: "error");
        walletService.Setup(s => s.GetCurfewStatusAsync(ct, It.IsAny<bool>())).ThrowsAsync(exception);

        // Act
        var result = await target.Get(ct);

        // Assert
        result.Should().BeOfType<TechnicalErrorMessageResult>();
        log.Logged.Single().Verify(LogLevel.Error, exception);
    }
}
