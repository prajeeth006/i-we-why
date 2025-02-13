using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Caching.Isolation;
using Frontend.Vanilla.Core.Ioc;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.Caching;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Infrastructure.Caching;

public class UserDataContainerManagerTests
{
    private UserDataContainerManager target;
    private Mock<ILabelIsolatedDistributedCache> distributedCache;
    private ICurrentContextAccessor currentContextAccessor;
    private ICurrentUserAccessor currentUserAccessor;
    private Mock<IPosApiCacheDiagnostics> cacheDiagnostics;
    private TestClock clock;
    private TestLogger<UserDataContainerManager> log;

    private PosApiAuthTokens authTokens;
    private CancellationToken ct;
    private ExecutionMode mode;

    public UserDataContainerManagerTests()
    {
        distributedCache = new Mock<ILabelIsolatedDistributedCache>();
        currentContextAccessor = Mock.Of<ICurrentContextAccessor>(r => r.Items == new ConcurrentDictionary<object, Lazy<object>>());
        currentUserAccessor = Mock.Of<ICurrentUserAccessor>();
        cacheDiagnostics = new Mock<IPosApiCacheDiagnostics>();
        clock = new TestClock();
        log = new TestLogger<UserDataContainerManager>();
        target = new UserDataContainerManager(distributedCache.Object, currentContextAccessor, currentUserAccessor, cacheDiagnostics.Object, clock, log);

        authTokens = new PosApiAuthTokens("user-token", "session-token");
        ct = TestCancellationToken.Get();
        mode = ExecutionMode.Async(ct);

        clock.UtcNow = new UtcDateTime(2001, 2, 3, 10, 30, 0);
        cacheDiagnostics.Setup(d => d.GetInfo()).Returns(new Dictionary<string, object> { { "Diagnostics", "Info" } });
        currentUserAccessor.User = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(PosApiClaimTypes.UserToken, authTokens.UserToken),
            new Claim(PosApiClaimTypes.SessionToken, authTokens.SessionToken),
        }));
        distributedCache.SetupWithAnyArgs(c => c.Get(null)).Returns(GetTestBytes());
    }

    private static byte[] GetTestBytes() => @"{
                Loyalty: {
                    Value: { Points: 666, Category: 'VIP' },
                    Expires: '2006-02-03T04:05:06Z'
                },
                Balance: {
                    Value: { Money: 123, Currency: 'THX' },
                    Expires: '2010-02-03T04:05:06Z'
                }
            }".EncodeToBytes();

    [Fact]
    public async Task GetContainerAsync_ShouldLoadFromDistributedCache()
    {
        var hasLocked = false;
        distributedCache.SetupWithAnyArgs(c => c.Get(null))
            .Callback(() => hasLocked = Monitor.IsEntered(currentContextAccessor.Items))
            .Returns(GetTestBytes());

        await Task.WhenAll(Enumerable.Range(0, 10000).Select(x => Task.Factory.StartNew(async () => await target.GetContainerAsync(mode, authTokens))));

        distributedCache.VerifyWithAnyArgs(c => c.Get(null), Times.Once);
    }

    [Fact]
    public async Task GetContainerAsync_ShouldGetFromContextItems_IfAlreadyLoaded()
    {
        var initialResult = await target.GetContainerAsync(mode, authTokens); // Initial load

        var result = await target.GetContainerAsync(mode, authTokens); // Act

        result.Should().BeSameAs(initialResult);
        distributedCache.VerifyWithAnyArgs(c => c.Get(null), Times.Once);
        log.VerifyNothingLogged();
    }

    [Fact]
    public void GetContainerAsync_ShouldLoadFromDistributedCacheOnlyOnceInMultiThread()
    {
        var hasLocked = false;
        distributedCache.SetupWithAnyArgs(c => c.Get(null))
            .Callback(() => hasLocked = Monitor.IsEntered(currentContextAccessor.Items))
            .Returns(GetTestBytes());

        Parallel.For(0, 10000, async _ => await target.GetContainerAsync(mode, authTokens));

        distributedCache.VerifyWithAnyArgs(c => c.Get(null), Times.Once);
    }

    [Fact]
    public async Task GetContainerAsync_ShouldThrow_IfContainerAlreadyDisposed()
    {
        await target.GetContainerAsync(mode, authTokens); // Create cached entry
        currentContextAccessor.Items.Values.Select(x => x.Value).OfType<UserDataContainer>().Single().Dispose();

        Func<Task> act = () => target.GetContainerAsync(mode, authTokens);

        await act.Should().ThrowAsync<ObjectDisposedException>();
        log.VerifyNothingLogged();
    }

    [Fact]
    public void OnContextBeginAsync_ShouldDoNothing()
        => target.OnContextBeginAsync(ct).Should().BeSameAs(Task.CompletedTask);

    [Fact]
    public Task OnContextEndAsync_ShouldSetContainerBackToDistributedCache_IfModified()
        => RunSetToCacheTest(
            modifyContainer: c => c.IsModified = true,
            expectedJsonSetToCache: @"{
                    Loyalty: {
                        Value: { Points: 666, Category: 'VIP' },
                        Expires: '2006-02-03T04:05:06Z'
                    },
                    Balance: {
                        Value: { Money: 123, Currency: 'THX' },
                        Expires: '2010-02-03T04:05:06Z'
                    },
                    __Created: {
                        Value: { Diagnostics: 'Info' },
                        Expires: '0001-01-01T00:00:00Z'
                    }
                }");

    [Fact]
    public Task OnContextEndAsync_ShouldSetContainerBackToDistributedCache_IfSomeItemExpired()
        => RunSetToCacheTest(
            modifyContainer: c => c.Items["Loyalty"] = new UserDataItem(c.Items["Loyalty"].Json, clock.UtcNow + TimeSpan.FromDays(-1)),
            expectedJsonSetToCache: @"{
                    Balance: {
                        Value: { Money: 123, Currency: 'THX' },
                        Expires: '2010-02-03T04:05:06Z'
                    },
                    __Created: {
                        Value: { Diagnostics: 'Info' },
                        Expires: '0001-01-01T00:00:00Z'
                    }
                }");

    private async Task RunSetToCacheTest(Action<UserDataContainer> modifyContainer, string expectedJsonSetToCache)
    {
        var container = await target.GetContainerAsync(mode, authTokens); // Create cached entry
        modifyContainer(container);

        (string Key, byte[] Value, DistributedCacheEntryOptions Options, CancellationToken Token) cacheCall = default;
        distributedCache.SetupWithAnyArgs(c => c.SetAsync(null, null, null, default))
            .Callback<string, byte[], DistributedCacheEntryOptions, CancellationToken>((k, v, o, t) => cacheCall = (k, v, o, t))
            .Returns(Task.CompletedTask);

        await target.OnContextEndAsync(ct); // Act

        distributedCache.VerifyWithAnyArgs(c => c.SetAsync(null, null, null, default), Times.Once);
        distributedCache.VerifyWithAnyArgs(c => c.RemoveAsync(null, default), Times.Never);
        cacheCall.Key.Should().Be($"Van:PosApi:{PosApiDataType.User}Data:session-token");
        cacheCall.Value.DecodeToString().Should().BeJson(expectedJsonSetToCache);
        cacheCall.Options.AbsoluteExpiration.Should().Be(new DateTimeOffset(2010, 2, 3, 4, 5, 6, TimeSpan.Zero)); // Should be max of items's Expires
        cacheCall.Token.Should().Be(ct);
        container.IsDisposed.Should().BeTrue();
        log.VerifyNothingLogged();
    }

    [Fact]
    public async Task OnContextEndAsync_ShouldNotCallDistributedCache_IfDataNotModified()
    {
        var container = await target.GetContainerAsync(mode, authTokens); // Create cached entry

        await RunNoCallToDistributedCacheTest(); // Act

        container.IsDisposed.Should().BeTrue();
    }

    [Fact]
    public Task OnContextEndAsync_ShouldNotCallDistributedCache_IfNoContainerCached()
        => RunNoCallToDistributedCacheTest();

    [Fact]
    public async Task OnContextEndAsync_ShouldNotCallDistributedCache_IfUserNotAuthenticated()
    {
        currentUserAccessor.User = new ClaimsPrincipal(new ClaimsIdentity());

        await RunNoCallToDistributedCacheTest(); // Act

        Mock.Get(currentContextAccessor).VerifyGet(r => r.Items, Times.Never);
    }

    private async Task RunNoCallToDistributedCacheTest()
    {
        await target.OnContextEndAsync(ct); // Act

        distributedCache.VerifyWithAnyArgs(c => c.SetAsync(null, null, null, default), Times.Never);
        distributedCache.VerifyWithAnyArgs(c => c.RemoveAsync(null, default), Times.Never);
        log.VerifyNothingLogged();
    }

    [Fact]
    public async Task OnContextEndAsync_ShouldHandleExceptions()
    {
        var ex = new Exception("Cache error");
        var container = await target.GetContainerAsync(mode, authTokens); // Create cached entry
        container.IsModified = true;
        distributedCache.SetupWithAnyArgs(c => c.SetAsync(null, null, null, TestContext.Current.CancellationToken)).ThrowsAsync(ex);

        await target.OnContextEndAsync(ct); // Act

        log.Logged.Single().Verify(LogLevel.Error, ex);
    }
}
