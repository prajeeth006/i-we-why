using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.Retail;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.Json.ActionResults;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Retail;
using Frontend.Vanilla.ServiceClients.Services.Retail.PayoutValueTicket;
using Frontend.Vanilla.ServiceClients.Services.Retail.TerminalSession;
using Frontend.Vanilla.ServiceClients.Services.Retail.ValueTicket;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.Retail;

public class RetailControllerTests
{
    private readonly RetailController target;
    private readonly Mock<IPosApiRetailServiceInternal> posApiRetailServiceMock;
    private readonly TestLogger<RetailController> log;
    private readonly CancellationToken cancellationToken;
    private readonly ExecutionMode executionMode;

    private readonly ValueTicketRequest valueTicketRequest = new () { Id = "V", Source = "Terminal" };

    private readonly PayoutValueTicketRequest payoutValueTicketRequest = new ()
    {
        Id = "v",
        Source = "terminal",
        ShopId = "1",
        TerminalId = "2",
        AgentName = "bond",
        Description = "james bond",
    };

    public RetailControllerTests()
    {
        posApiRetailServiceMock = new Mock<IPosApiRetailServiceInternal>();
        log = new TestLogger<RetailController>();
        target = new RetailController(posApiRetailServiceMock.Object, log);

        cancellationToken = TestCancellationToken.Get();
        executionMode = TestExecutionMode.Get();
    }

    #region GetValueTicket

    [Fact]
    public async Task GetValueTicket_ShouldReturnResponse()
    {
        // Setup
        var response = new ValueTicketResponse();
        posApiRetailServiceMock.Setup(s => s.GetValueTicketAsync(valueTicketRequest, cancellationToken)).ReturnsAsync(response);

        // Act
        var result = (OkObjectResult)await target.GetValueTicket(valueTicketRequest, cancellationToken);

        // Assert
        result.Value.Should().BeEquivalentTo(response);
    }

    [Fact]
    public async Task GetValueTicket_ShouldReturnTechnicalError_OnPosApiException()
    {
        // Setup
        var exception = new PosApiException(message: "error", posApiCode: 500);
        posApiRetailServiceMock.Setup(s => s.GetValueTicketAsync(valueTicketRequest, cancellationToken)).ThrowsAsync(exception);

        // Act
        var result = await target.GetValueTicket(valueTicketRequest, cancellationToken);

        // Assert
        result.Should().BeOfType<TechnicalErrorMessageResult>();
        log.Logged.Single().Verify(LogLevel.Error, exception);
    }

    [Fact]
    public async Task GetValueTicket_ShouldReturnTechnicalError_OnGeneralException()
    {
        // Setup
        var exception = new Exception(message: "error");
        posApiRetailServiceMock.Setup(s => s.GetValueTicketAsync(valueTicketRequest, cancellationToken)).ThrowsAsync(exception);

        // Act
        var result = await target.GetValueTicket(valueTicketRequest, cancellationToken);

        // Assert
        result.Should().BeOfType<TechnicalErrorMessageResult>();
        log.Logged.Single().Verify(LogLevel.Error, exception);
    }

    #endregion

    #region PayoutValueTicket

    [Fact]
    public async Task PayoutValueTicket_ShouldReturnResponse()
    {
        // Setup
        var response = new PayoutValueTicketResponse();
        posApiRetailServiceMock.Setup(s => s.PayoutValueTicketAsync(payoutValueTicketRequest, cancellationToken)).ReturnsAsync(response);

        // Act
        var result = (OkObjectResult)await target.PayoutValueTicket(payoutValueTicketRequest, cancellationToken);

        // Assert
        result.Value.Should().BeEquivalentTo(response);
    }

    [Fact]
    public async Task PayoutValueTicket_ShouldReturnTechnicalError_OnPosApiException()
    {
        // Setup
        var exception = new PosApiException(message: "error", posApiCode: 500);
        posApiRetailServiceMock.Setup(s => s.PayoutValueTicketAsync(payoutValueTicketRequest, cancellationToken)).ThrowsAsync(exception);

        // Act
        var result = await target.PayoutValueTicket(payoutValueTicketRequest, cancellationToken);

        // Assert
        result.Should().BeOfType<TechnicalErrorMessageResult>();
        log.Logged.Single().Verify(LogLevel.Error, exception);
    }

    [Fact]
    public async Task PayoutValueTicket_ShouldReturnTechnicalError_OnGeneralException()
    {
        // Setup
        var exception = new Exception(message: "error");
        posApiRetailServiceMock.Setup(s => s.PayoutValueTicketAsync(payoutValueTicketRequest, cancellationToken)).ThrowsAsync(exception);

        // Act
        var result = await target.PayoutValueTicket(payoutValueTicketRequest, cancellationToken);

        // Assert
        result.Should().BeOfType<TechnicalErrorMessageResult>();
        log.Logged.Single().Verify(LogLevel.Error, exception);
    }

    #endregion

    #region GetTerminalSession

    [Fact]
    public async Task GetTerminalSession_ShouldReturnResponse()
    {
        // Setup
        var response = new TerminalSessionDto();
        posApiRetailServiceMock.Setup(s => s.GetTerminalSessionAsync(executionMode, It.IsAny<bool>())).ReturnsAsync(response);

        // Act
        var result = (OkObjectResult)await target.GetTerminalSession(cancellationToken);

        // Assert
        result.Value.Should().BeEquivalentTo(response);
    }

    [Fact]
    public async Task GetTerminalSession_ShouldReturnTechnicalError_OnPosApiException()
    {
        // Setup
        var exception = new PosApiException(message: "error", posApiCode: 500);
        posApiRetailServiceMock.Setup(s => s.GetTerminalSessionAsync(executionMode, It.IsAny<bool>())).ThrowsAsync(exception);

        // Act
        var result = await target.GetTerminalSession(cancellationToken);

        // Assert
        result.Should().BeOfType<TechnicalErrorMessageResult>();
        log.Logged.Single().Verify(LogLevel.Error, exception);
    }

    [Fact]
    public async Task GetTerminalSession_ShouldReturnTechnicalError_OnGeneralException()
    {
        // Setup
        var exception = new Exception(message: "error");
        posApiRetailServiceMock.Setup(s => s.GetTerminalSessionAsync(executionMode, It.IsAny<bool>())).ThrowsAsync(exception);

        // Act
        var result = await target.GetTerminalSession(cancellationToken);

        // Assert
        result.Should().BeOfType<TechnicalErrorMessageResult>();
        log.Logged.Single().Verify(LogLevel.Error, exception);
    }

    #endregion
}
