using System;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Wallet;
using Frontend.Vanilla.ServiceClients.Services.Wallet.UserSessionFundSummary;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public class SessionFundSummaryDslExecutorTests
{
    private ISessionFundSummaryDslExecutor target;
    private Mock<ICurrentUserAccessor> currentUserAccessor;
    private Mock<IPosApiWalletServiceInternal> posApiWalletService;

    private ExecutionMode mode;
    private Mock<Func<SessionFundSummary, decimal>> getProperty;

    public SessionFundSummaryDslExecutorTests()
    {
        currentUserAccessor = new Mock<ICurrentUserAccessor>();
        posApiWalletService = new Mock<IPosApiWalletServiceInternal>();
        target = new SessionFundSummaryDslExecutor(currentUserAccessor.Object, posApiWalletService.Object);

        var summary = new SessionFundSummary();
        mode = TestExecutionMode.Get();
        getProperty = new Mock<Func<SessionFundSummary, decimal>>();

        currentUserAccessor.SetupGet(a => a.User.Identity.IsAuthenticated).Returns(true);
        posApiWalletService.Setup(s => s.GetSessionFundSummary(mode, true)).ReturnsAsync(summary);
        getProperty.Setup(g => g(summary)).Returns(66.6m);
    }

    [Fact]
    public async Task ShouldGetSummaryProperty()
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
        posApiWalletService.VerifyWithAnyArgs(s => s.GetSessionFundSummary(default, default), Times.Never);
        getProperty.VerifyWithAnyArgs(g => g(null), Times.Never);
    }
}
