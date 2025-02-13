using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Wallet;
using Frontend.Vanilla.ServiceClients.Services.Wallet.Balances;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public class TourneyTokenBalanceDslProviderTests
{
    private ITourneyTokenBalanceDslProvider target;
    private Mock<ICurrentUserAccessor> currentUserAccessorMock;
    private Mock<IPosApiWalletServiceInternal> posApiWalletServiceInternalMock;

    private readonly ExecutionMode mode;

    public TourneyTokenBalanceDslProviderTests()
    {
        currentUserAccessorMock = new Mock<ICurrentUserAccessor>();
        posApiWalletServiceInternalMock = new Mock<IPosApiWalletServiceInternal>();
        mode = TestExecutionMode.Get();
        currentUserAccessorMock.SetupGet(a => a.User.Identity.IsAuthenticated).Returns(true);
        posApiWalletServiceInternalMock.Setup(p => p.GetTourneyTokenBalance(It.IsAny<ExecutionMode>())).ReturnsAsync(new TourneyTokenBalanceDto("EUR", 10));

        target = new TourneyTokenBalanceDslProvider(currentUserAccessorMock.Object, posApiWalletServiceInternalMock.Object);
    }

    [Fact]
    public async Task ShouldGetBalanceForAuthenticatedUser()
    {
        var result = await target.GetBalanceAsync(mode);

        result.Should().Be(10);
    }

    [Fact]
    public async Task ShouldGetBalanceForAnonymousUser()
    {
        currentUserAccessorMock.SetupGet(a => a.User.Identity.IsAuthenticated).Returns(false);
        var result = await target.GetBalanceAsync(mode);

        result.Should().Be(-1);
    }

    [Fact]
    public async Task ShouldGetCurrencyForAuthenticatedUser()
    {
        var result = await target.GetCurrencyAsync(mode);

        result.Should().Be("EUR");
    }

    [Fact]
    public async Task ShouldGetCurrencyForAnonymourUser()
    {
        currentUserAccessorMock.SetupGet(a => a.User.Identity.IsAuthenticated).Returns(false);
        var result = await target.GetCurrencyAsync(mode);

        result.Should().Be("");
    }
}
