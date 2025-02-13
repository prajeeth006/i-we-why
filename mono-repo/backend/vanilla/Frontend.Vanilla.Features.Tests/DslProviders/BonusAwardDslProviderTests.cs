using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Promohub;
using Frontend.Vanilla.ServiceClients.Services.Promohub.BonusAward;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public class BonusAwardDslProviderTests
{
    private readonly IBonusAwardDslProvider target;
    private readonly Mock<IPosApiPromohubServiceInternal> posApiPromohubService;
    private readonly ExecutionMode mode;
    private readonly Mock<ICurrentUserAccessor> currentUserAccessor;

    public BonusAwardDslProviderTests()
    {
        posApiPromohubService = new Mock<IPosApiPromohubServiceInternal>();
        mode = TestExecutionMode.Get();
        currentUserAccessor = new Mock<ICurrentUserAccessor>();
        currentUserAccessor.SetupGet(a => a.User.Identity.IsAuthenticated).Returns(true);

        target = new BonusAwardDslProvider(posApiPromohubService.Object, currentUserAccessor.Object);
    }

    [Fact]
    public async Task GetStatusAsync_ShouldReturnAwardedBonusFalse()
    {
        var bonus = new BonusAwardResponse(new IssuedBonus(false));
        posApiPromohubService.Setup(x => x.GetBonusAwardAsync(mode, "12")).ReturnsAsync(bonus);

        var status = await target.IsBonusAwarded(mode, "12"); // Act

        status.Should().Be(false);
    }

    [Fact]
    public async Task GetStatusAsync_ShouldReturnAwardedBonusTrue()
    {
        var bonus = new BonusAwardResponse(new IssuedBonus(true));
        posApiPromohubService.Setup(x => x.GetBonusAwardAsync(mode, "12"))
            .ReturnsAsync(bonus);

        var status = await target.IsBonusAwarded(mode, "12"); // Act

        status.Should().Be(true);
    }

    [Fact]
    public async Task GetStatusAsync_ShouldReturnFalseForUnAuthUser()
    {
        var bonus = new BonusAwardResponse(new IssuedBonus(false));
        posApiPromohubService.Setup(x => x.GetBonusAwardAsync(mode, "12"))
            .ReturnsAsync(bonus);
        currentUserAccessor.SetupGet(u => u.User.Identity.IsAuthenticated).Returns(false);

        var status = await target.IsBonusAwarded(mode, "12"); // Act

        status.Should().Be(false);
    }
}
