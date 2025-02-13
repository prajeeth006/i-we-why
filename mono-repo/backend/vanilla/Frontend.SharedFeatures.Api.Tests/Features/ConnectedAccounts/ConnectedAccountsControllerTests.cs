using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.ConnectedAccounts;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Account;
using Frontend.Vanilla.ServiceClients.Services.Account.ConnectedAccounts;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.ConnectedAccounts;

public class ConnectedAccountsControllerTests
{
    private readonly ConnectedAccountsController target;
    private readonly Mock<ICurrentUserAccessor> currentUserAccessor;
    private readonly Mock<IPosApiAccountServiceInternal> posApiAccountService;
    private readonly CancellationToken ct;

    public ConnectedAccountsControllerTests()
    {
        currentUserAccessor = new Mock<ICurrentUserAccessor>();
        posApiAccountService = new Mock<IPosApiAccountServiceInternal>();
        target = new ConnectedAccountsController(currentUserAccessor.Object, posApiAccountService.Object);

        ct = new CancellationTokenSource().Token;
    }

    [Fact]
    public async Task GetCount_ShouldReturnZeroIfNotLoggedIn()
    {
        // Setup
        currentUserAccessor.SetupGet(u => u.User.Identity!.IsAuthenticated).Returns(false);
        // Act
        var result = (OkObjectResult)await target.GetCount(ct);

        // Assert
        result.Value.Should().BeEquivalentTo(new { count = 0 });
    }

    [Fact]
    public async Task GetCount_ShouldWork()
    {
        // Setup
        currentUserAccessor.SetupGet(u => u.User.Identity!.IsAuthenticated).Returns(true);
        posApiAccountService.Setup(a => a.GetConnectedAccountsAsync(ct))
            .ReturnsAsync(new ConnectedAccount[] { new ("brand1", "true"), new ("brand2", "false"), new ("brand3", "true") });
        // Act
        var result = (OkObjectResult)await target.GetCount(ct);

        // Assert
        result.Value.Should().BeEquivalentTo(new { count = 1 });
    }
}
