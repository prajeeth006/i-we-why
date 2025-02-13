using System;
using System.Net.Http;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Caching.Isolation;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.MyBets.CustomerHasBets;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.Extensions.Caching.Distributed;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.MyBets.CustomerHasBets;

public class CustomerHasBetsServiceClientTests
{
    private ICustomerHasBetsServiceClient target;
    private Mock<IPosApiRestClient> restClient;
    private Mock<ILabelIsolatedDistributedCache> distributeCache;
    private Mock<ICurrentUserAccessor> user;
    private readonly CancellationToken ct;
    private const string CacheKey = "BPOS:Betting:HasBets:Testuser:onlyone@yop.com";

    public CustomerHasBetsServiceClientTests()
    {
        restClient = new Mock<IPosApiRestClient>();
        distributeCache = new Mock<ILabelIsolatedDistributedCache>();
        user = new Mock<ICurrentUserAccessor>();
        ct = TestCancellationToken.Get();

        target = new CustomerHasBetsServiceClient(restClient.Object, distributeCache.Object, user.Object);

        var identity = new ClaimsIdentity("Vanilla");
        identity.AddClaim(new Claim(PosApiClaimTypes.AccountName, "Testuser"));
        identity.AddClaim(new Claim(PosApiClaimTypes.Email, "onlyone@yop.com"));
        user.SetupGet(c => c.User).Returns(() => new ClaimsPrincipal(identity));
    }

    [Fact]
    public async Task ShouldReturnCachedValue()
    {
        distributeCache.Setup(c => c.GetAsync(CacheKey, ct)).ReturnsAsync("true".EncodeToBytes());
        var result = await target.GetAsync(ct, true);

        result.Should().Be(true);
        distributeCache.Verify(c => c.GetAsync(CacheKey, ct));
    }

    [Fact]
    public async Task ShouldReturnFreshValueAndCache()
    {
        var restResponse = new CustomerHasBetsResponse(true);
        var cachedValue = "true".EncodeToBytes();
        restClient.Setup(c => c.ExecuteAsync<CustomerHasBetsResponse>(It.IsAny<PosApiRestRequest>(), ct)).ReturnsAsync(restResponse);
        var result = await target.GetAsync(ct, false);

        result.Should().Be(true);
        restClient.Verify(x => x.ExecuteAsync<CustomerHasBetsResponse>(
                It.Is<PosApiRestRequest>(p =>
                    p.Url.ToString().Contains("myBets/v1/customer-has-bets") &&
                    p.Authenticate &&
                    p.Method == HttpMethod.Get),
                It.IsAny<CancellationToken>()),
            Times.Once);
        distributeCache.Verify(c => c.SetAsync(CacheKey, cachedValue, It.Is<DistributedCacheEntryOptions>(c => c.AbsoluteExpirationRelativeToNow == TimeSpan.FromDays(1)), ct));
    }
}
