using System.Security.Claims;
using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.Registration;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Account;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.Registration;

public class RegistrationControllerTests
{
    private readonly RegistrationInfoController target;
    private readonly Mock<ICurrentUserAccessor> currentUserAccessor;
    private readonly Mock<IPosApiAccountServiceInternal> posApiAccountService;
    private readonly TestClock clock;
    private readonly TestLogger<RegistrationInfoController> log;

    private ClaimsPrincipal user;
    private readonly CancellationToken cancellationToken;

    public RegistrationControllerTests()
    {
        currentUserAccessor = new Mock<ICurrentUserAccessor>();
        posApiAccountService = new Mock<IPosApiAccountServiceInternal>();
        clock = new TestClock { UtcNow = new UtcDateTime(2021, 7, 8, 14, 5, 6) };
        log = new TestLogger<RegistrationInfoController>();
        target = new RegistrationInfoController(
            posApiAccountService.Object,
            clock,
            currentUserAccessor.Object,
            log);

        user = TestUser.Get();
        cancellationToken = TestCancellationToken.Get();

        currentUserAccessor.SetupGet(c => c.User).Returns(() => user);
    }

    [Fact]
    public async Task Get_ShouldReturnRegistrationInfoResponse()
    {
        posApiAccountService.Setup(x => x.GetRegistrationDateAsync(cancellationToken)).ReturnsAsync(
            new UtcDateTime(2004, 10, 11, 11, 22, 53));

        var result = (OkObjectResult)await target.Get(cancellationToken); // Act

        dynamic response = result.Value!;
        ((string)response.date).Should().Contain("2004-10-11");
        ((int)response.daysRegistered).Should().Be(6114);
    }

    [Fact]
    public async Task Get_ShouldReturnBadRequest_OnPosApiException()
    {
        // Setup
        var exception = new PosApiException(message: "error", posApiCode: 500);
        posApiAccountService.Setup(x => x.GetRegistrationDateAsync(cancellationToken)).ThrowsAsync(exception);

        // Act
        var result = await target.Get(cancellationToken);

        // Assert
        result.Should().BeOfType<BadRequestResult>();
        log.Logged.Single().Verify(LogLevel.Error, exception);
    }
}
