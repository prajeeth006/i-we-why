using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Wallet;
using Frontend.Vanilla.ServiceClients.Services.Wallet.GetCurfewStatus;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public class CurfewStatusDslProviderTests
{
    private ICurfewStatusDslProvider target;
    private Mock<ICurrentUserAccessor> currentUserAccessor;
    private Mock<IPosApiWalletServiceInternal> posApiWalletService;
    private ExecutionMode mode;

    public CurfewStatusDslProviderTests()
    {
        currentUserAccessor = new Mock<ICurrentUserAccessor>();
        posApiWalletService = new Mock<IPosApiWalletServiceInternal>();
        target = new CurfewStatusDslProvider(
            currentUserAccessor.Object,
            posApiWalletService.Object);

        mode = TestExecutionMode.Get();
    }

    [Fact]
    public async Task IsDepositCurfewOn_ShouldBeFalseWhenNotAuthenticated()
    {
        currentUserAccessor.SetupGet(u => u.User.Identity.IsAuthenticated).Returns(false);

        var result = await target.GetIsDepositCurfewOnAsync(mode); // Act
        result.Should().BeFalse();
    }

    [Fact]
    public async Task IsDepositCurfewOn_ShouldBeCorrect()
    {
        currentUserAccessor.SetupGet(u => u.User.Identity.IsAuthenticated).Returns(true);

        posApiWalletService
            .Setup(a => a.GetCurfewStatusAsync(mode.AsyncCancellationToken.Value, true))
            .ReturnsAsync(new GetCurfewStatusDto { IsDepositCurfewOn = true });

        var result = await target.GetIsDepositCurfewOnAsync(mode); // Act
        result.Should().BeTrue();
    }
}
