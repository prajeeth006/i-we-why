using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Account;
using Frontend.Vanilla.ServiceClients.Services.Account.ConnectedAccounts;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public class ConnectedAccountsDslProviderTests
{
    private IConnectedAccountsDslProvider target;
    private Mock<ICurrentUserAccessor> currentUserAccessor;
    private Mock<IPosApiAccountServiceInternal> posApiAccountService;
    private ExecutionMode mode;

    public ConnectedAccountsDslProviderTests()
    {
        currentUserAccessor = new Mock<ICurrentUserAccessor>();
        posApiAccountService = new Mock<IPosApiAccountServiceInternal>();
        target = new ConnectedAccountsDslProvider(
            currentUserAccessor.Object,
            posApiAccountService.Object);

        mode = TestExecutionMode.Get();
    }

    [Fact]
    public async Task Count_ShouldBeZeroWhenNotAuthenticated()
    {
        currentUserAccessor.SetupGet(u => u.User.Identity.IsAuthenticated).Returns(false);

        var result = await target.GetCountAsync(mode); // Act
        result.Should().Be(0);
    }

    [Fact]
    public async Task Count_ShouldCalculate()
    {
        currentUserAccessor.SetupGet(u => u.User.Identity.IsAuthenticated).Returns(true);

        posApiAccountService
            .Setup(a => a.GetConnectedAccountsAsync(mode.AsyncCancellationToken.Value))
            .ReturnsAsync(new ConnectedAccount[] { new ("brand1", "true"), new ("brand2", "false"), new ("brand3", "true") });

        var result = await target.GetCountAsync(mode); // Act
        result.Should().Be(1);
    }
}
