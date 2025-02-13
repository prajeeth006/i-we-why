using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.ReferredFriends;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.Json.ActionResults;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Crm;
using Frontend.Vanilla.ServiceClients.Services.Crm.InvitationUrl;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.ReferredFriends;

public class ReferredFriendsControllerTests
{
    private readonly ReferredFriendsController target;
    private readonly Mock<IPosApiCrmServiceInternal> posApiCrmServiceInternalMock;
    private readonly TestLogger<ReferredFriendsController> log;
    private readonly CancellationToken ct;
    private readonly ExecutionMode mode;

    public ReferredFriendsControllerTests()
    {
        posApiCrmServiceInternalMock = new Mock<IPosApiCrmServiceInternal>();
        log = new TestLogger<ReferredFriendsController>();
        ct = new CancellationTokenSource().Token;
        mode = ExecutionMode.Async(ct);

        target = new ReferredFriendsController(posApiCrmServiceInternalMock.Object, log);
    }

    [Fact]
    public async Task GetInvitationUrl_ShouldReturnResult()
    {
        // Setup
        var response = new InvitationUrl("http://example.com");
        posApiCrmServiceInternalMock.Setup(s => s.GetInvitationUrlAsync(mode, It.IsAny<bool>()))
            .ReturnsAsync(response);

        // Act
        var result = (OkObjectResult)await target.GetInvitationUrl(ct);

        // Assert
        result.Value.Should().BeEquivalentTo(response);
    }

    [Fact]
    public async Task GetInvitationUrl_ShouldLogError_OnException()
    {
        // Setup
        var exception = new PosApiException(message: "error", posApiCode: 500);
        posApiCrmServiceInternalMock.Setup(s => s.GetInvitationUrlAsync(mode, It.IsAny<bool>())).ThrowsAsync(exception);

        // Act
        var result = await target.GetInvitationUrl(ct);

        // Assert
        result.Should().BeOfType<TechnicalErrorMessageResult>();
        log.Logged.Single().Verify(LogLevel.Error, exception);
    }
}
