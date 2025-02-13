#nullable enable

using System.Threading.Tasks;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login.Filters;
using Frontend.Vanilla.ServiceClients.Services.Common.Currencies;
using Frontend.Vanilla.ServiceClients.Services.Wallet.Balances;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Model.Authentication.Filters;

public class CacheBalanceLoginFilterTests
{
    private readonly LoginFilter target;
    private readonly Mock<IBalanceServiceClient> balanceServiceClient;
    private readonly AfterLoginContext ctx;

    public CacheBalanceLoginFilterTests()
    {
        balanceServiceClient = new Mock<IBalanceServiceClient>();
        target = new CacheBalanceLoginFilter(balanceServiceClient.Object);

        ctx = new AfterLoginContext(TestExecutionMode.Get(), null!, new LoginResponse());
    }

    [Fact]
    public async Task ShouldSetBalanceToCache()
    {
        var dto = new BalancePosApiDto();
        var balance = new Balance(new Currency());
        ctx.Response.Balance = dto;
        balanceServiceClient.Setup(c => c.ConvertAsync(ctx.Mode, dto)).ReturnsAsync(balance);

        // Act
        await target.AfterLoginAsync(ctx);

        balanceServiceClient.Verify(c => c.SetToCacheAsync(ctx.Mode, balance));
    }

    [Fact]
    public async Task ShouldDoNothing_IfNoBalance()
    {
        // Act
        await target.AfterLoginAsync(ctx);

        balanceServiceClient.VerifyNoOtherCalls();
    }
}
