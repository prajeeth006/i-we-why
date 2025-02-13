using System;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Caching.Isolation;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.Features.Login;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Microsoft.Extensions.Caching.Distributed;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.RememberMe;

public class RememberMeTokenStorageTests
{
    private IRememberMeTokenStorage target;
    private Mock<ILabelIsolatedDistributedCache> distributedCache;
    private Mock<IAuthenticationConfiguration> authConfig;
    private Mock<ICurrentUserAccessor> currentUserAccessor;
    private CancellationToken ct;

    public RememberMeTokenStorageTests()
    {
        distributedCache = new Mock<ILabelIsolatedDistributedCache>();
        currentUserAccessor = new Mock<ICurrentUserAccessor>();
        authConfig = new Mock<IAuthenticationConfiguration>();
        target = new RememberMeTokenStorage(distributedCache.Object, currentUserAccessor.Object, authConfig.Object);

        ct = TestCancellationToken.Get();
        currentUserAccessor.SetupGet(a => a.User).Returns(new ClaimsPrincipal(new ClaimsIdentity(
            new[] { new Claim(PosApiClaimTypes.SessionToken, "ss") })));
    }

    [Fact]
    public async Task GetAsync_ShouldGetTokenFromCache()
    {
        distributedCache.Setup(c => c.GetAsync("LH:RememberMeToken:ss", ct)).ReturnsAsync("tt".EncodeToBytes());

        // Act
        var token = await target.GetAsync(ct);

        token.Should().Be("tt");
    }

    [Fact]
    public async Task GetAsync_ShouldReturnNull_IfNoToken()
    {
        distributedCache.Setup(c => c.GetAsync("LH:RememberMeToken:ss", ct)).ReturnsAsync(() => null);

        // Act
        var token = await target.GetAsync(ct);

        token.Should().BeNull();
    }

    [Fact]
    public void GetAsync_ShouldFail_IfMissingAuthClaims()
        => RunMissingAuthClaimsTest(() => target.GetAsync(ct));

    [Fact]
    public async Task SetAsync_ShouldSetTokenToCache()
    {
        authConfig.SetupGet(x => x.Timeout).Returns(TimeSpan.FromMinutes(20));
        // Act
        await target.SetAsync("tt", ct);

        distributedCache.VerifyWithAnyArgs(c => c.SetAsync(null, null, null, TestContext.Current.CancellationToken));
        distributedCache.Invocations.Single().Arguments.Should().BeEquivalentOrderedTo(
            "LH:RememberMeToken:ss",
            "tt".EncodeToBytes(),
            new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(20) },
            ct);
    }

    [Fact]
    public void SetAsync_ShouldFail_IfMissingAuthClaims()
        => RunMissingAuthClaimsTest(() => target.SetAsync("tt", ct));

    [Fact]
    public async Task DeleteAsync_ShouldRemoveTokenFromCache()
    {
        // Act
        await target.DeleteAsync(ct);

        distributedCache.Verify(c => c.RemoveAsync("LH:RememberMeToken:ss", ct));
    }

    [Fact]
    public void DeleteAsync_ShouldFail_IfMissingAuthClaims()
        => RunMissingAuthClaimsTest(() => target.DeleteAsync(ct));

    private void RunMissingAuthClaimsTest(Func<Task> act)
    {
        currentUserAccessor.SetupGet(a => a.User).Returns(new ClaimsPrincipal(new ClaimsIdentity()));
        act.Should().ThrowAsync<InvalidOperationException>();
    }
}
