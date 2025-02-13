using System;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Common.Currencies;
using Frontend.Vanilla.ServiceClients.Services.Wallet;
using Frontend.Vanilla.ServiceClients.Services.Wallet.Balances;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public class BalanceDslExecutorTests
{
    private IBalanceDslExecutor target;
    private Mock<ICurrentUserAccessor> currentUserAccessor;
    private Mock<IPosApiWalletServiceInternal> posApiWalletService;

    private ExecutionMode mode;
    private Mock<Func<Balance, decimal>> getProperty;

    public BalanceDslExecutorTests()
    {
        currentUserAccessor = new Mock<ICurrentUserAccessor>();
        posApiWalletService = new Mock<IPosApiWalletServiceInternal>();
        target = new BalanceDslExecutor(currentUserAccessor.Object, posApiWalletService.Object);

        var balance = new Balance(new Currency());
        mode = TestExecutionMode.Get();
        getProperty = new Mock<Func<Balance, decimal>>();

        currentUserAccessor.SetupGet(a => a.User.Identity.IsAuthenticated).Returns(true);
        posApiWalletService.Setup(s => s.GetBalanceAsync(mode, true)).ReturnsAsync(balance);
        getProperty.Setup(g => g(balance)).Returns(66.6m);
    }

    [Fact]
    public async Task ShouldGetBalanceProperty()
    {
        // Act
        var result = await target.GetAsync(mode, getProperty.Object);

        result.Should().Be(66.6m);
    }

    [Fact]
    public async Task ShouldNotGetBalanceProperty_IfAnonymous()
    {
        currentUserAccessor.SetupGet(a => a.User.Identity.IsAuthenticated).Returns(false);

        // Act
        var result = await target.GetAsync(mode, getProperty.Object);

        result.Should().Be(BalanceDslExecutor.AnonymousValue);
        posApiWalletService.VerifyWithAnyArgs(s => s.GetBalanceAsync(default, default), Times.Never);
        getProperty.VerifyWithAnyArgs(g => g(null), Times.Never);
    }
}
