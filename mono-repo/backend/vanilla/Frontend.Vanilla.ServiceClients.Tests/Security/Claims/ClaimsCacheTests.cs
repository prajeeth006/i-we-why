using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Caching.Isolation;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Security.Claims;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Moq;
using Newtonsoft.Json;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Security.Claims;

public class ClaimsCacheTestsWithAuth() : ClaimsCacheTests(true) { }

public class ClaimsCacheTestsWithoutAuth() : ClaimsCacheTests(false) { }

public abstract class ClaimsCacheTests : IDisposable
{
    private readonly bool authenticated;
    private readonly IClaimsCache target;
    private readonly Mock<ILabelIsolatedDistributedCache> distributedCache;
    private readonly Mock<IClientIPResolver> clientIPResolver;
    private readonly IClaimsCacheTime tokenCacheTime;
    private readonly TestLogger<ClaimsCache> log;

    private readonly PosApiAuthTokens authTokens;
    private readonly string expectedCacheKeySuffix;
    private readonly string expectedCacheKey;
    private readonly IReadOnlyList<Claim> testClaims;
    private readonly CancellationToken ct;
    private readonly ExecutionMode mode;

    public ClaimsCacheTests(bool authenticated)
    {
        this.authenticated = authenticated;
        distributedCache = new Mock<ILabelIsolatedDistributedCache>();
        tokenCacheTime = Mock.Of<IClaimsCacheTime>(t => t.Value == TimeSpan.FromSeconds(666) && t.AnonymousClaimCacheTime == TimeSpan.FromSeconds(666));
        clientIPResolver = new Mock<IClientIPResolver>();
        log = new TestLogger<ClaimsCache>();
        target = new ClaimsCache(distributedCache.Object, clientIPResolver.Object, tokenCacheTime, log);

        authTokens = authenticated ? new PosApiAuthTokens("chuck-norris", Guid.NewGuid().ToString("N")) : null;
        expectedCacheKeySuffix = authenticated ? "User:" + authTokens.SessionToken : "Anonymous:1.2.3.4";
        expectedCacheKey = "Van:PosApi:Claims:" + expectedCacheKeySuffix;
        testClaims = new[]
        {
            new Claim(PosApiClaimTypes.Name, "Chuck Norris"),
            new Claim(PosApiClaimTypes.Email, "gmail@chucknorris.com", "Email", "Google", "NSA"),
            authenticated ? new Claim(PosApiClaimTypes.UserToken, authTokens.UserToken) : null,
            authenticated ? new Claim(PosApiClaimTypes.SessionToken, authTokens.SessionToken) : null,
        }.Where(c => c != null).ToList();
        ct = TestCancellationToken.Get();
        mode = ExecutionMode.Async(ct);

        clientIPResolver.Setup(r => r.Resolve()).Returns(IPAddress.Parse("1.2.3.4"));
    }

    public void Dispose()
        => clientIPResolver.Verify(r => r.Resolve(), authenticated ? Times.Never() : Times.Exactly(1));

    [Fact]
    public async Task GetAsync_ShouldReturnFromNewDistributedCache()
    {
        distributedCache.Setup(x => x.GetAsync(expectedCacheKey, ct))
            .ReturnsAsync(JsonConvert.SerializeObject(testClaims).EncodeToBytes());

        var result = await target.GetAsync(mode, authTokens); // Act

        result.Should().BeEquivalentTo(testClaims);
        log.VerifyNothingLogged();
    }

    [Fact]
    public async Task GetAsync_ShouldHandleErrors()
    {
        var ex = new Exception("Read error");
        distributedCache.Setup(x => x.GetAsync(expectedCacheKey, ct)).ThrowsAsync(ex);

        var result = await target.GetAsync(mode, authTokens); // Act

        result.Should().BeNull();
        log.Logged.Single().Verify(LogLevel.Error, ex, ("cacheKey", expectedCacheKeySuffix));
    }

    [Fact]
    public async Task SetAsync_ShouldSetClaims()
    {
        await target.SetAsync(mode, testClaims); // Act

        var expectedJsonBytes = JsonConvert.SerializeObject(testClaims.Select(c => new ClaimsCache.ClaimDto(c.Type, c.Value, c.ValueType, c.Issuer, c.OriginalIssuer)))
            .EncodeToBytes();
        distributedCache.Verify(c =>
            c.SetAsync(expectedCacheKey, expectedJsonBytes, It.Is<DistributedCacheEntryOptions>(o => o.AbsoluteExpirationRelativeToNow == tokenCacheTime.Value), ct));
        distributedCache.VerifyWithAnyArgs(c => c.SetAsync(null, null, null, TestContext.Current.CancellationToken), Times.Once);
        log.VerifyNothingLogged();
    }

    [Fact]
    public async Task SetAsync_ShouldHandleErrors()
    {
        var ex = new Exception("Read error");
        distributedCache.Setup(c => c.SetAsync(expectedCacheKey, It.IsAny<byte[]>(), It.IsAny<DistributedCacheEntryOptions>(), ct)).ThrowsAsync(ex);

        await target.SetAsync(mode, testClaims); // Act

        log.Logged.Single().Verify(LogLevel.Error, ex, ("cacheKey", expectedCacheKeySuffix));
    }

    [Fact]
    public async Task RemoveAsync_ShouldRemoveClaims()
    {
        await target.RemoveAsync(mode, authTokens); // Act

        distributedCache.Verify(c => c.RemoveAsync(expectedCacheKey, ct), Times.Once());
        log.VerifyNothingLogged();
    }

    [Fact]
    public async Task RemoveAsync_ShouldHandleErrors()
    {
        var ex = new Exception("Read error");
        distributedCache.Setup(c => c.RemoveAsync(expectedCacheKey, ct)).ThrowsAsync(ex);

        await target.RemoveAsync(mode, authTokens); // Act

        log.Logged.Single().Verify(LogLevel.Error, ex, ("cacheKey", expectedCacheKeySuffix));
    }
}
