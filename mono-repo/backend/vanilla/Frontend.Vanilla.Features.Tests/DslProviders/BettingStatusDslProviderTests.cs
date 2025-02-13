using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.MyBets;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public class BettingStatusDslProviderTests
{
    private readonly IBettingStatusDslProvider provider;
    private readonly Mock<IPosApiMyBetsService> posApiMyBetsService;
    private readonly Mock<ICurrentUserAccessor> currentUserAccessor;
    private readonly ExecutionMode mode;

    public BettingStatusDslProviderTests()
    {
        mode = TestExecutionMode.Get();
        posApiMyBetsService = new Mock<IPosApiMyBetsService>();
        currentUserAccessor = new Mock<ICurrentUserAccessor>();

        provider = new BettingStatusDslProvider(posApiMyBetsService.Object, currentUserAccessor.Object);
    }

    [Fact]
    public async Task GetUserHasBetsAsync_ShouldReturnDefaultValue_IfUnauthenticated()
    {
        // Setup
        currentUserAccessor.SetupGet(u => u.User.Identity.IsAuthenticated).Returns(false);
        // Act
        var result = await provider.UserHasBets(mode);

        // Assert
        result.Should().Be(false);
    }

    [Fact]
    public async Task GetUserHasBetsAsync_ShouldReturnValue_IfAuthenticated()
    {
        // Setup
        posApiMyBetsService.Setup(c => c.GetAsync(It.IsAny<CancellationToken>(), true)).ReturnsAsync(true);
        currentUserAccessor.SetupGet(u => u.User.Identity.IsAuthenticated).Returns(true);

        // Act
        var result = await provider.UserHasBets(mode);

        // Assert
        result.Should().Be(true);
    }
}
