using Frontend.Vanilla.ServiceClients.Services.Authentication.Login;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login.Filters;
using Frontend.Vanilla.ServiceClients.Services.Crm.LoyaltyProfiles;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Model.Authentication.Filters;

public class CacheLoyalyProfileLoginFilterTests
{
    private readonly LoginFilter target;
    private readonly Mock<ILoyaltyProfileServiceClient> loyaltyProfileServiceClient;
    private readonly AfterLoginContext ctx;

    public CacheLoyalyProfileLoginFilterTests()
    {
        loyaltyProfileServiceClient = new Mock<ILoyaltyProfileServiceClient>();
        target = new CacheLoyalyProfileLoginFilter(loyaltyProfileServiceClient.Object);

        ctx = new AfterLoginContext(TestExecutionMode.Get(), null!, new LoginResponse());
    }

    [Fact]
    public void ShouldSetLoyaltyProfileToCache()
    {
        var loyalty = new LoyaltyProfile();
        ctx.Response.LoyaltyStatus = loyalty;

        // Act
        target.AfterLogin(ctx);

        loyaltyProfileServiceClient.Verify(c => c.SetToCache(loyalty));
    }

    [Fact]
    public void ShouldDoNothing_IfNoLoyaltyProfile()
    {
        // Act
        target.AfterLogin(ctx);

        loyaltyProfileServiceClient.VerifyNoOtherCalls();
    }
}
