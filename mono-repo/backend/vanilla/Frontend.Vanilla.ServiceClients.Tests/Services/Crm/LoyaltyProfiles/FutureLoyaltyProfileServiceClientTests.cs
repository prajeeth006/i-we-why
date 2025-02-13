using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Crm.LoyaltyProfiles;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Crm.LoyaltyProfiles;

public class FutureLoyaltyProfileServiceClientTests
{
    private IFutureLoyaltyProfileServiceClient target;
    private Mock<ILoyaltyProfileServiceClient> loyaltyProfileServiceClient;
    private Mock<IBasicLoyaltyProfileServiceClient> basicLoyaltyProfileServiceClient;
    private Mock<IPosApiDataCache> posApiDataCache;
    private ExecutionMode mode;

    public FutureLoyaltyProfileServiceClientTests()
    {
        loyaltyProfileServiceClient = new Mock<ILoyaltyProfileServiceClient>();
        basicLoyaltyProfileServiceClient = new Mock<IBasicLoyaltyProfileServiceClient>();
        posApiDataCache = new Mock<IPosApiDataCache>();
        mode = TestExecutionMode.Get();
        target = new FutureLoyaltyProfileServiceClient(loyaltyProfileServiceClient.Object, basicLoyaltyProfileServiceClient.Object, posApiDataCache.Object);
    }

    [Fact]
    public void GetBasicProfileAsync_Cached_False()
    {
        target.GetBasicProfileAsync(mode, false);

        basicLoyaltyProfileServiceClient.Verify(c => c.InvalidateCached());
        loyaltyProfileServiceClient.Verify(c => c.InvalidateCached());
        basicLoyaltyProfileServiceClient.Verify(c => c.GetAsync(mode, false));
    }

    [Fact]
    public void GetBasicProfileAsync_Cached_True()
    {
        target.GetBasicProfileAsync(mode, true);

        basicLoyaltyProfileServiceClient.Verify(c => c.GetAsync(mode, true));
    }

    [Fact]
    public async Task GetBasicProfileAsync_Cached_True_FromPosApiCache()
    {
        posApiDataCache.Setup(c => c.GetAsync<LoyaltyProfile>(mode, PosApiDataType.User, "LoyaltyProfile"))
            .ReturnsAsync(new Wrapper<LoyaltyProfile>(new LoyaltyProfile("B", 3, true)));
        var result = await target.GetBasicProfileAsync(mode, true);

        result.Should().BeEquivalentTo(new BasicLoyaltyProfile("B", 3, true));
    }
}
