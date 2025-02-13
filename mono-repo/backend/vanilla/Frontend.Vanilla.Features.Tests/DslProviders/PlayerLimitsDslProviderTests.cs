using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.PlayerLimits;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public class PlayerLimitsDslProviderTests
{
    private readonly IPlayerLimitsDslProvider provider;
    private readonly Mock<IPlayerLimitsServiceClient> playerLimitsServiceClientMock;
    private readonly Mock<ICurrentUserAccessor> currentUserAccessorMock;
    private readonly ExecutionMode mode;

    public PlayerLimitsDslProviderTests()
    {
        mode = TestExecutionMode.Get();
        playerLimitsServiceClientMock = new Mock<IPlayerLimitsServiceClient>();
        currentUserAccessorMock = new Mock<ICurrentUserAccessor>();

        currentUserAccessorMock.SetupGet(a => a.User).Returns(TestUser.Get(AuthState.Authenticated));

        provider = new PlayerLimitsDslProvider(playerLimitsServiceClientMock.Object, currentUserAccessorMock.Object);
    }

    [Fact]
    public async Task GetPlayerLimitsSumAsync_ShouldReturnLimitsSum()
    {
        // Setup
        playerLimitsServiceClientMock
            .Setup(x => x.GetPlayerLimitsAsync(mode))
            .ReturnsAsync(GetPlayerLimits(count: 3));

        // Act
        var limitsSum = await provider.GetPlayerLimitsSumAsync(mode, "1,2");

        // Assert
        limitsSum.Should().Be(3000m);
    }

    [Fact]
    public async Task GetPlayerLimitsSumAsync_ShouldReturnSingleLimitsValue()
    {
        // Setup
        playerLimitsServiceClientMock
            .Setup(x => x.GetPlayerLimitsAsync(mode))
            .ReturnsAsync(GetPlayerLimits(count: 1));

        // Act
        var limitsSum = await provider.GetPlayerLimitsSumAsync(mode, "1"); // Act

        // Assert
        limitsSum.Should().Be(1000);
    }

    [Fact]
    public async Task GetPlayerLimitsSumAsync_ShouldReturnAnonymousValue_ForUnauthenticatedUser()
    {
        // Setup
        currentUserAccessorMock.SetupGet(a => a.User).Returns(TestUser.Get());

        // Act
        var limitsSum = await provider.GetPlayerLimitsSumAsync(mode, "1"); // Act

        // Assert
        limitsSum.Should().Be(-1);
        playerLimitsServiceClientMock.Verify(x => x.GetPlayerLimitsAsync(mode), Times.Never);
    }

    private static ServiceClients.Services.ResponsibleGaming.PlayerLimits.PlayerLimits GetPlayerLimits(int count)
    {
        var limits = new List<Limit>();

        for (var i = 1; i <= count; i++)
        {
            limits.Add(new Limit { LimitType = i.ToString(), CurrentLimit = i * 1000 });
        }

        return new ServiceClients.Services.ResponsibleGaming.PlayerLimits.PlayerLimits
        {
            WaitingPeriodInDays = 30,
            Limits = limits,
        };
    }
}
