using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.Inventory;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.Json.ActionResults;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Common;
using Frontend.Vanilla.ServiceClients.Services.Common.Inventory.Shop;
using Frontend.Vanilla.ServiceClients.Services.Common.Inventory.Terminal;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.Inventory;

public class InventoryControllerTests
{
    private readonly InventoryController target;
    private readonly Mock<IPosApiCommonServiceInternal> posApiRetailServiceMock;
    private readonly TestLogger<InventoryController> log;

    private readonly CancellationToken cancellationToken;

    public InventoryControllerTests()
    {
        posApiRetailServiceMock = new Mock<IPosApiCommonServiceInternal>();
        log = new TestLogger<InventoryController>();

        target = new InventoryController(posApiRetailServiceMock.Object, log);
        cancellationToken = TestCancellationToken.Get();
    }

    [Fact]
    public async Task GetShopDetails_ShouldReturnValueTicketResponse()
    {
        // Setup
        var response = new ShopDetailsResponse();
        posApiRetailServiceMock.Setup(s => s.GetShopDetailsAsync(It.IsAny<ExecutionMode>(), "1", It.IsAny<bool>())).ReturnsAsync(response);

        // Act
        var result = (OkObjectResult)await target.GetShopDetails("1", cancellationToken);

        // Assert
        result.Value.Should().BeEquivalentTo(response);
    }

    [Fact]
    public async Task GetShopDetails_ShouldReturnTechnicalError_OnPosApiException()
    {
        // Setup
        var exception = new PosApiException(message: "error", posApiCode: 500);
        posApiRetailServiceMock.Setup(s => s.GetShopDetailsAsync(It.IsAny<ExecutionMode>(), "1", It.IsAny<bool>())).ThrowsAsync(exception);

        // Act
        var result = await target.GetShopDetails("1", cancellationToken);

        // Assert
        result.Should().BeOfType<TechnicalErrorMessageResult>();
        log.Logged.Single().Verify(LogLevel.Error, exception);
    }

    [Fact]
    public async Task GetShopDetails_ShouldReturnTechnicalError_OnGeneralException()
    {
        // Setup
        var exception = new Exception(message: "error");
        posApiRetailServiceMock.Setup(s => s.GetShopDetailsAsync(It.IsAny<ExecutionMode>(), "1", It.IsAny<bool>())).ThrowsAsync(exception);

        // Act
        var result = await target.GetShopDetails("1", cancellationToken);

        // Assert
        result.Should().BeOfType<TechnicalErrorMessageResult>();
        log.Logged.Single().Verify(LogLevel.Error, exception);
    }

    [Fact]
    public async Task GetTerminalDetails_ShouldReturnTerminalDetailsResponse()
    {
        // Setup
        var request = new TerminalDetailsRequest();
        var response = new TerminalDetailsResponse();
        posApiRetailServiceMock.Setup(s => s.GetTerminalDetailsAsync(It.IsAny<ExecutionMode>(), request)).ReturnsAsync(response);

        // Act
        var result = (OkObjectResult)await target.GetTerminalDetails(request, cancellationToken);

        // Assert
        result.Value.Should().BeEquivalentTo(response);
    }

    [Fact]
    public async Task GetTerminalDetails_ShouldReturnTechnicalError_OnPosApiException()
    {
        // Setup
        var request = new TerminalDetailsRequest();
        var exception = new PosApiException(message: "error", posApiCode: 500);
        posApiRetailServiceMock.Setup(s => s.GetTerminalDetailsAsync(It.IsAny<ExecutionMode>(), request)).ThrowsAsync(exception);

        // Act
        var result = await target.GetTerminalDetails(request, cancellationToken);

        // Assert
        result.Should().BeOfType<TechnicalErrorMessageResult>();
        log.Logged.Single().Verify(LogLevel.Error, exception);
    }

    [Fact]
    public async Task GetTerminalDetails_ShouldReturnTechnicalError_OnGeneralException()
    {
        // Setup
        var request = new TerminalDetailsRequest();
        var exception = new Exception(message: "error");
        posApiRetailServiceMock.Setup(s => s.GetTerminalDetailsAsync(It.IsAny<ExecutionMode>(), request)).ThrowsAsync(exception);

        // Act
        var result = await target.GetTerminalDetails(request, cancellationToken);

        // Assert
        result.Should().BeOfType<TechnicalErrorMessageResult>();
        log.Logged.Single().Verify(LogLevel.Error, exception);
    }
}
