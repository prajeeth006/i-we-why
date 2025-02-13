using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.UserFlags;
using Frontend.Vanilla.Features.Json.ActionResults;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Crm;
using Frontend.Vanilla.ServiceClients.Services.Crm.UserFlags;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.UserFlags;

public class UserFlagsControllerTests
{
    private readonly UserFlagsController target;
    private readonly Mock<IPosApiCrmServiceInternal> posApiCrmService;
    private readonly TestLogger<UserFlagsController> log;
    private readonly CancellationToken ct;
    private readonly IReadOnlyList<UserFlag> userFlags;

    public UserFlagsControllerTests()
    {
        posApiCrmService = new Mock<IPosApiCrmServiceInternal>();
        log = new TestLogger<UserFlagsController>();
        ct = TestCancellationToken.Get();

        target = new UserFlagsController(posApiCrmService.Object, log);

        userFlags = new List<UserFlag>
        {
            new ("NO_OFFER", "Enabled", new[] { "R100", "R101" }),
            new ("BONUS", "Disabled"),
            new ("Test", "Enabled"),
        };

        posApiCrmService.Setup(s => s.GetUserFlagsAsync(ct, It.IsAny<bool>())).ReturnsAsync(userFlags);
    }

    [Fact]
    public async Task Get_ShouldReturnUserFlags()
    {
        // Act
        var result = (OkObjectResult)await target.Get(ct);

        // Asset
        result.Value.Should().BeEquivalentTo(new { userFlags });
    }

    [Fact]
    public async Task Get_ShouldReturnTechnicalError_OnPosApiException()
    {
        // Setup
        var exception = new PosApiException(message: "error", posApiCode: 500);
        posApiCrmService.Setup(s => s.GetUserFlagsAsync(ct, It.IsAny<bool>())).ThrowsAsync(exception);

        // Act
        var result = await target.Get(ct);

        // Assert
        result.Should().BeOfType<TechnicalErrorMessageResult>();
        log.Logged.Single().Verify(LogLevel.Error, exception);
    }

    [Fact]
    public async Task Get_ShouldReturnTechnicalError_OnGeneralException()
    {
        // Setup
        var exception = new Exception(message: "error");
        posApiCrmService.Setup(s => s.GetUserFlagsAsync(ct, It.IsAny<bool>())).ThrowsAsync(exception);

        // Act
        var result = await target.Get(ct);

        // Assert
        result.Should().BeOfType<TechnicalErrorMessageResult>();
        log.Logged.Single().Verify(LogLevel.Error, exception);
    }

    [Fact]
    public void InvalidateCache_ShouldClearTheCache()
    {
        // Act
        var result = target.InvalidateCache();

        // Assert
        result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public void InvalidateCache_ShouldReturnTechnicalError_OnGeneralException()
    {
        // Setup
        var exception = new Exception(message: "error");
        posApiCrmService.Setup(s => s.InvalidateCached()).Throws(exception);

        // Act
        var result = target.InvalidateCache();

        // Assert
        result.Should().BeOfType<TechnicalErrorMessageResult>();
        log.Logged.Single().Verify(LogLevel.Error, exception);
    }
}
