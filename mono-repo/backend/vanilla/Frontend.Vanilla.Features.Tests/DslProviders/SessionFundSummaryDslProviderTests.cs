using System;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.ServiceClients.Services.Wallet.UserSessionFundSummary;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public class SessionFundSummaryDslProviderTests
{
    private ISessionFundSummaryDslProvider target;
    private Mock<ISessionFundSummaryDslExecutor> executor;
    private ExecutionMode mode;

    public SessionFundSummaryDslProviderTests()
    {
        executor = new Mock<ISessionFundSummaryDslExecutor>();
        target = new SessionFundSummaryDslProvider(executor.Object);
        mode = TestExecutionMode.Get();
    }

    [Fact]
    public async Task GetInitialBalanceAsync_Test()
        => await RunTest(() => target.GetInitialBalanceAsync(mode), expectedProperty: 10);

    [Fact]
    public async Task GetCurrentBalanceAsync_Test()
        => await RunTest(() => target.GetCurrentBalanceAsync(mode), expectedProperty: 20);

    [Fact]
    public async Task GetLossAsync_Test()
        => await RunTest(() => target.GetLossAsync(mode), expectedProperty: 5);

    [Fact]
    public async Task GetProfitAsync_Test()
        => await RunTest(() => target.GetProfitAsync(mode), expectedProperty: 15);

    [Fact]
    public async Task GetTotalStakeAsync_Test()
        => await RunTest(() => target.GetTotalStakeAsync(mode), expectedProperty: 3);

    private async Task RunTest(Func<Task<decimal>> act, decimal expectedProperty)
    {
        var summary = new SessionFundSummary(initialBalance: 10, currentBalance: 20, loss: 5, profit: 15, totalStake: 3);

        executor.Setup(e => e.GetAsync(mode, It.IsAny<Func<SessionFundSummary, decimal>>())).ReturnsAsync(666);

        var result = await act();

        result.Should().Be(666);
        var getProperty = (Func<SessionFundSummary, decimal>)executor.Invocations.Single().Arguments[1];
        getProperty(summary).Should().Be(expectedProperty);
    }
}
