using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Features.BalanceProperties;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Common.Currencies;
using Frontend.Vanilla.ServiceClients.Services.Wallet;
using Frontend.Vanilla.ServiceClients.Services.Wallet.Balances;
using Frontend.Vanilla.Testing.AbstractTests;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.BalanceProperties;

public class BalancePropertiesClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private readonly Mock<IPosApiWalletService> posApiWalletServiceMock;
    private readonly Mock<ICachedUserValuesFlag> cachedUserValuesFlagMock;
    private readonly Mock<ICurrentUserAccessor> currentUserAccessor;
    private readonly Mock<ILogger<BalancePropertiesClientConfigProvider>> logMock;
    private readonly CancellationToken ct;
    private readonly Balance balanceProperties;

    public BalancePropertiesClientConfigProviderTests()
    {
        posApiWalletServiceMock = new Mock<IPosApiWalletService>();
        cachedUserValuesFlagMock = new Mock<ICachedUserValuesFlag>();
        logMock = new Mock<ILogger<BalancePropertiesClientConfigProvider>>();
        currentUserAccessor = new Mock<ICurrentUserAccessor> { DefaultValue = DefaultValue.Mock };

        ct = TestCancellationToken.Get();
        balanceProperties = new Balance(new Currency(), accountBalance: 100m);

        posApiWalletServiceMock.Setup(s => s.GetBalanceAsync(ct, It.IsAny<bool>())).ReturnsAsync(balanceProperties);
        cachedUserValuesFlagMock.Setup(f => f.GetCached(ct)).Returns(Task.FromResult(true));

        Target = new BalancePropertiesClientConfigProvider(posApiWalletServiceMock.Object, cachedUserValuesFlagMock.Object, currentUserAccessor.Object, logMock.Object);
    }

    [Fact]
    public void ShouldHaveCorrectName()
    {
        Target.Name.Should().Be("vnBalanceProperties");
    }

    [Fact]
    public async Task ShouldReturnEmptyObject_UnauthenticatedUser()
    {
        currentUserAccessor.SetupGet(c => c.User).Returns(TestUser.Get());
        var result = await Target.GetClientConfigAsync(ct);

        result.Should().NotBeNull();
        result.GetType().GetProperties().Should().BeEmpty("because the user is not authenticated.");
    }

    [Theory]
    [InlineData(AuthState.Authenticated)]
    [InlineData(AuthState.Workflow)]
    public async Task ShouldReturnBalanceProperties_AuthenticatedUser(AuthState authState)
    {
        currentUserAccessor.SetupGet(c => c.User).Returns(TestUser.Get(authState));

        var result = await Target.GetClientConfigAsync(ct);

        result.Should().BeEquivalentTo(new
        {
            balanceProperties,
        });
    }
}
