using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.Caching;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Infrastructure.Caching;

public sealed class PosApiDataCacheTests
{
    private ServiceClientsConfigurationBuilder builder;
    private Mock<IStaticDataCache> staticDataCache;
    private Mock<IUserDataCache> userDataCache;
    private ICurrentUserAccessor currentUserAccessor;
    private Mock<IPosApiRequestSemaphores> requestSemaphores;
    private TestLogger<PosApiDataCache> log;

    private ExecutionMode mode;
    private PosApiAuthTokens authTokens;
    private Exception testException;
    private Mock<Func<Task<string>>> factoryFunc;
    private Mock<IDisposable> semaphore;

    public PosApiDataCacheTests()
    {
        builder = new ServiceClientsConfigurationBuilder { AccessId = "access" };
        staticDataCache = new Mock<IStaticDataCache>();
        userDataCache = new Mock<IUserDataCache>();
        currentUserAccessor = Mock.Of<ICurrentUserAccessor>(a => a.User == new ClaimsPrincipal(new ClaimsIdentity()));
        requestSemaphores = new Mock<IPosApiRequestSemaphores>();
        log = new TestLogger<PosApiDataCache>();

        mode = TestExecutionMode.Get();
        authTokens = new PosApiAuthTokens("user-token", "session-token");
        testException = new Exception("Test error.");
        factoryFunc = new Mock<Func<Task<string>>>();
        semaphore = new Mock<IDisposable>();

        requestSemaphores.SetupWithAnyArgs(s => s.WaitDisposableAsync(default, default, null)).ReturnsAsync(semaphore.Object);
    }

    private PosApiDataCacheBase GetTarget() => GetTarget(builder);

    private PosApiDataCacheBase GetTarget(bool isApiCacheUsageStatsLoggingEnabled)
        => GetTarget(new ServiceClientsConfigurationBuilder
        {
            AccessId = "access",
            IsApiCacheUsageStatsLoggingEnabled = isApiCacheUsageStatsLoggingEnabled,
        });

    private PosApiDataCacheBase GetTarget(ServiceClientsConfigurationBuilder builder)
    {
        var config = builder.Build();

        return new PosApiDataCache(config, staticDataCache.Object, userDataCache.Object, currentUserAccessor, requestSemaphores.Object, log);
    }

    [Theory]
    [InlineData(false, false)]
    [InlineData(false, true)]
    [InlineData(true, false)]
    [InlineData(true, true)]
    public async Task GetAsync_ShouldUseStaticDataCache_IfStaticData(bool isCacheHit, bool authenticate)
    {
        staticDataCache.Setup(c => c.GetAsync(mode, "key", typeof(string))).ReturnsAsync(isCacheHit ? "foo" : null).Verifiable();
        await RunGetTest(PosApiDataType.Static, isCacheHit, authenticate);
    }

    [Theory, BooleanData]
    public async Task GetAsync_ShouldUseUserDataCache_IfUserData(bool isCacheHit)
    {
        userDataCache.Setup(c => c.GetAsync(mode, authTokens, "key", typeof(string))).ReturnsAsync(isCacheHit ? "foo" : null).Verifiable();
        await RunGetTest(PosApiDataType.User, isCacheHit, authenticate: true);
    }

    private async Task RunGetTest(PosApiDataType dataType, bool isCacheHit, bool authenticate)
    {
        SetupAuthenticatedUser(authenticate);

        // Act
        var entry = await GetTarget().GetAsync<string>(mode, dataType, "key"); // Act

        (entry != null).Should().Be(isCacheHit);
        (entry?.Value).Should().Be(isCacheHit ? "foo" : null);
        staticDataCache.Verify();
        userDataCache.Verify();
        log.VerifyNothingLogged();
    }

    [Fact]
    public async Task GetAsync_ShouldCheckResultType()
    {
        staticDataCache.SetupWithAnyArgs(c => c.GetAsync(default, null, null)).ReturnsAsync("not int");
        await RunFailedGetTest(PosApiDataType.Static, ex => ex is InvalidCastException);
    }

    [Theory]
    [InlineData(PosApiDataType.Static)]
    [InlineData(PosApiDataType.User)]
    public async Task GetAsync_ShouldHandleExceptions(PosApiDataType dataType)
    {
        SetupAuthenticatedUser();
        staticDataCache.SetupWithAnyArgs(c => c.GetAsync(default, null, null)).Throws(testException);
        userDataCache.SetupWithAnyArgs(c => c.GetAsync(default, null, null, null)).ThrowsAsync(testException);

        await RunFailedGetTest(dataType, ex => ex == testException);
    }

    private async Task RunFailedGetTest(PosApiDataType dataType, Expression<Func<Exception, bool>> loggedExceptionPredicate)
    {
        // Act
        var entry = await GetTarget().GetAsync<int>(mode, dataType, "foo");

        entry.Should().BeNull();
        log.Logged.Single().Verify(
            LogLevel.Error,
            loggedExceptionPredicate,
            ("dataType", dataType),
            ("resultType", typeof(int)),
            ("key", (TrimmedRequiredString)"foo"));
    }

    public static IEnumerable<object[]> GetDataTypeTestCases(bool withLoggingTestParam)
    {
        if (withLoggingTestParam)
        {
            foreach (var loggingIsEnabled in new bool?[] { null, false, true })
            {
                yield return new object[] { PosApiDataType.Static, false, loggingIsEnabled };
                yield return new object[] { PosApiDataType.Static, true, loggingIsEnabled };
                yield return new object[] { PosApiDataType.User, true, loggingIsEnabled };
            }

            yield break;
        }

        yield return new object[] { PosApiDataType.Static, false };
        yield return new object[] { PosApiDataType.Static, true };
        yield return new object[] { PosApiDataType.User, true };
    }

    [Theory, MemberData(nameof(GetDataTypeTestCases), arguments: false)]
    public async Task SetAsync_ShouldUseInnerCache_AccordingToDataType(PosApiDataType dataType, bool authenticated)
    {
        SetupAuthenticatedUser(authenticated);

        // Act
        await GetTarget().SetAsync(mode, dataType, "key", "value", null);

        userDataCache.Verify(c => c.SetAsync(mode, authTokens, "key", "value", builder.UserDataCacheTime),
            dataType == PosApiDataType.User ? Times.Once() : Times.Never());
        staticDataCache.Verify(c => c.SetAsync(mode, "key", "value", builder.StaticDataCacheTime), dataType == PosApiDataType.Static ? Times.Once() : Times.Never());
        log.VerifyNothingLogged();
    }

    [Theory]
    [InlineData(PosApiDataType.Static)]
    [InlineData(PosApiDataType.User)]
    public async Task SetAsync_ShouldHonorExpirationParameterOverConfigured(PosApiDataType dataType)
    {
        SetupAuthenticatedUser();
        var expiration = TimeSpan.FromSeconds(666);

        // Act
        await GetTarget().SetAsync(mode, dataType, "key", "value", expiration);

        userDataCache.Verify(c => c.SetAsync(mode, authTokens, "key", "value", expiration), dataType == PosApiDataType.User ? Times.Once() : Times.Never());
        staticDataCache.Verify(c => c.SetAsync(mode, "key", "value", expiration), dataType == PosApiDataType.Static ? Times.Once() : Times.Never());
        log.VerifyNothingLogged();
    }

    [Theory]
    [InlineData(PosApiDataType.Static, false)]
    [InlineData(PosApiDataType.Static, true)]
    [InlineData(PosApiDataType.User, false)]
    [InlineData(PosApiDataType.User, true)]
    public async Task SetAsync_ShouldNotCache_IfExpirationTimeIsZero(PosApiDataType dataType, bool disableViaArg)
    {
        TimeSpan? expiration = null;

        if (disableViaArg)
            expiration = TimeSpan.Zero;
        else if (dataType == PosApiDataType.User)
            builder.UserDataCacheTime = TimeSpan.Zero;
        else
            builder.StaticDataCacheTime = TimeSpan.Zero;

        SetupAuthenticatedUser();

        // Act
        await GetTarget().SetAsync(mode, dataType, "key", "value", expiration);

        userDataCache.VerifyWithAnyArgs(c => c.SetAsync(default, null, null, null, default), Times.Never);
        staticDataCache.VerifyWithAnyArgs(c => c.SetAsync(default, null, null, default), Times.Never);
    }

    [Theory]
    [InlineData(PosApiDataType.Static)]
    [InlineData(PosApiDataType.User)]
    public async Task SetAsync_ShouldHandleExceptions(PosApiDataType dataType)
    {
        SetupAuthenticatedUser();
        staticDataCache.SetupWithAnyArgs(c => c.SetAsync(default, null, null, default)).Throws(testException);
        userDataCache.SetupWithAnyArgs(c => c.SetAsync(default, null, null, null, default)).Throws(testException);

        // Act
        await GetTarget().SetAsync(mode, dataType, "foo", "value", null);

        log.Logged.Single().Verify(
            LogLevel.Error,
            testException,
            ("dataType", dataType),
            ("type", typeof(string)),
            ("key", (TrimmedRequiredString)"foo"));
    }

    [Theory, MemberData(nameof(GetDataTypeTestCases), arguments: false)]
    public async Task RemoveAsync_ShouldUseInnerCache_AccordingToDataType(PosApiDataType dataType, bool authenticated)
    {
        SetupAuthenticatedUser(authenticated);

        // Act
        await GetTarget().RemoveAsync(mode, dataType, "key");

        userDataCache.Verify(c => c.RemoveAsync(mode, authTokens, "key"), dataType == PosApiDataType.User ? Times.Once() : Times.Never());
        staticDataCache.Verify(c => c.RemoveAsync(mode, "key"), dataType == PosApiDataType.Static ? Times.Once() : Times.Never());
        log.VerifyNothingLogged();
    }

    [Theory]
    [InlineData(PosApiDataType.Static)]
    [InlineData(PosApiDataType.User)]
    public async Task RemoveAsync_ShouldHandleExceptions(PosApiDataType dataType)
    {
        SetupAuthenticatedUser();
        staticDataCache.SetupWithAnyArgs(c => c.RemoveAsync(default, null)).Throws(testException);
        userDataCache.SetupWithAnyArgs(c => c.RemoveAsync(default, null, null)).Throws(testException);

        // Act
        await GetTarget().RemoveAsync(mode, dataType, "foo");

        log.Logged.Single().Verify(
            LogLevel.Error,
            testException,
            ("dataType", dataType),
            ("key", (TrimmedRequiredString)"foo"));
    }

    [Theory, MemberData(nameof(GetDataTypeTestCases), arguments: true)]
    public async Task GetOrCreateAsync_ShouldCreateNewValue(PosApiDataType dataType, bool authenticate, bool loggingIsEnabled)
    {
        SetupAuthenticatedUser(authenticate);
        factoryFunc.Setup(f => f()).ReturnsAsync("value");

        // Act
        var result = await GetTarget(loggingIsEnabled).GetOrCreateAsync(mode, dataType, "key", factoryFunc.Object);

        result.Should().Be("value");
        userDataCache.Verify(c => c.GetAsync(mode, authTokens, "key", typeof(string)), dataType == PosApiDataType.User ? Times.Exactly(2) : Times.Never());
        userDataCache.Verify(c => c.SetAsync(mode, authTokens, "key", "value", builder.UserDataCacheTime),
            dataType == PosApiDataType.User ? Times.Once() : Times.Never());
        staticDataCache.Verify(c => c.GetAsync(mode, "key", typeof(string)), dataType == PosApiDataType.Static ? Times.Exactly(2) : Times.Never());
        staticDataCache.Verify(c => c.SetAsync(mode, "key", "value", builder.StaticDataCacheTime), dataType == PosApiDataType.Static ? Times.Once() : Times.Never());
        VerifyRequestSemaphoreAwaited(dataType);

        VerifyLogCalls(log, loggingIsEnabled);
    }

    [Theory, MemberData(nameof(GetDataTypeTestCases), arguments: true)]
    public async Task GetOrCreateAsync_ShouldGetExistingValue(PosApiDataType dataType, bool authenticate, bool loggingIsEnabled)
    {
        SetupAuthenticatedUser(authenticate);
        userDataCache.SetupWithAnyArgs(c => c.GetAsync(default, null, null, null)).ReturnsAsync("value");
        staticDataCache.SetupWithAnyArgs(c => c.GetAsync(default, null, null)).ReturnsAsync("value");

        // Act
        var result = await GetTarget(loggingIsEnabled).GetOrCreateAsync(mode, dataType, "key", factoryFunc.Object);

        result.Should().Be("value");
        factoryFunc.Verify(f => f(), Times.Never);
        userDataCache.Verify(c => c.GetAsync(mode, authTokens, "key", typeof(string)), dataType == PosApiDataType.User ? Times.Once() : Times.Never());
        staticDataCache.Verify(c => c.GetAsync(mode, "key", typeof(string)), dataType == PosApiDataType.Static ? Times.Once() : Times.Never());
        requestSemaphores.Invocations.Should().BeEmpty();

        VerifyLogCalls(log, loggingIsEnabled);
    }

    private static void VerifyLogCalls(TestLogger<PosApiDataCache> log, bool loggingIsEnabled)
    {
        if (loggingIsEnabled)
        {
            var data = log.Logged.Single().Data;
            data.ContainsKey("key").Should().BeTrue();
            data.ContainsKey("isMiss").Should().BeTrue();
            data.ContainsKey("dataType").Should().BeTrue();
            data.ContainsKey("expiration").Should().BeTrue();

            return;
        }

        log.VerifyNothingLogged();
    }

    [Fact]
    public async Task GetOrCreateAsync_ShouldCreateNewValueDirectly_IfCachedFalse()
    {
        SetupAuthenticatedUser();
        factoryFunc.Setup(f => f()).ReturnsAsync("value");

        // Act
        var result = await GetTarget().GetOrCreateAsync(mode, PosApiDataType.User, "key", factoryFunc.Object, cached: false);

        result.Should().Be("value");
        userDataCache.VerifyWithAnyArgs(c => c.GetAsync(default, null, null, null), Times.Never);
        userDataCache.Verify(c => c.SetAsync(mode, authTokens, "key", "value", builder.UserDataCacheTime));
        VerifyRequestSemaphoreAwaited(PosApiDataType.User);
        log.VerifyNothingLogged();
    }

    [Theory, ValuesData(0, -66)]
    public async Task GetOrCreateAsync_ShouldCreateNewValueDirectly_WithoutCachingAndLocking_IfCachingDisable(int expiration)
    {
        factoryFunc.Setup(f => f()).ReturnsAsync("value");

        // Act
        var result = await GetTarget().GetOrCreateAsync(mode, PosApiDataType.User, "key", factoryFunc.Object, relativeExpiration: TimeSpan.FromSeconds(expiration));

        result.Should().Be("value");
        userDataCache.Invocations.Should().BeEmpty();
        requestSemaphores.Invocations.Should().BeEmpty();
        log.VerifyNothingLogged();
    }

    [Fact]
    public void GetOrCreateAsync_ShouldThrow_IfAsyncTaskForSyncExecution()
    {
        var task = TestTask.GetRunning<string>();
        var target = GetTarget();

        Func<Task> act = async () => await target.GetOrCreateAsync(ExecutionMode.Sync, PosApiDataType.Static, "key", () => task);

        act.Should().ThrowAsync<InvalidAsyncExecutionException>();
    }

    [Fact]
    public void GetOrCreateAsync_ShouldThrow_IfValueFactoryReturnsNullTask()
        => RunGetOrCreateFailedTest<string>(taskToReturn: null, expectedErrorMsg: "Factory for System.String returned null task hence it can't be awaited.");

    [Fact]
    public void GetOrCreateAsync_ShouldThrow_IfNullReturnedByValueFactory()
        => RunGetOrCreateFailedTest(Task.FromResult<string>(null), expectedErrorMsg: $"Result from factory for {typeof(string)} is null which can't be cached.");

    private void RunGetOrCreateFailedTest<T>(Task<T> taskToReturn, string expectedErrorMsg)
    {
        var target = GetTarget();

        Func<Task> act = async () => await target.GetOrCreateAsync(mode, PosApiDataType.Static, "key", () => taskToReturn);

        act.Should().ThrowAsync<Exception>().WithMessage(expectedErrorMsg + " DataType: Static, Key: 'key'.");
        log.VerifyNothingLogged();
    }

    public static readonly IEnumerable NotAuthenticatedTestCases = new Expression<Func<IPosApiDataCache, Task>>[]
    {
        t => t.GetAsync<string>(ExecutionMode.Sync, PosApiDataType.User, "key"),
        t => t.SetAsync(ExecutionMode.Sync, PosApiDataType.User, "key", "value", null),
        t => t.RemoveAsync(ExecutionMode.Sync, PosApiDataType.User, "key"),
        t => t.GetOrCreateAsync(ExecutionMode.Sync, PosApiDataType.User, "key", () => Task.FromResult(""), true, null),
    };

    [Theory, MemberValuesData(nameof(NotAuthenticatedTestCases))]
    public void ShouldThrow_IfUserNotAuthenticated_WhenUserDataAccessed(Expression<Func<IPosApiDataCache, Task>> testCodeExpr)
    {
        var target = GetTarget();
        var testCode = testCodeExpr.Compile();

        var act = () => testCode(target);

        act.Should().ThrowAsync<NotAuthenticatedWithPosApiException>();
        log.VerifyNothingLogged();
    }

    private void SetupAuthenticatedUser(bool authenticated = true)
    {
        if (!authenticated)
            return;

        currentUserAccessor.User.SetOrRemoveClaim(PosApiClaimTypes.UserToken, authTokens.UserToken);
        currentUserAccessor.User.SetOrRemoveClaim(PosApiClaimTypes.SessionToken, authTokens.SessionToken);
    }

    private void VerifyRequestSemaphoreAwaited(PosApiDataType dataType)
    {
        requestSemaphores.Verify(s => s.WaitDisposableAsync(mode, dataType, "key"), Times.Once);
        requestSemaphores.Invocations.Should().HaveCount(1);
        semaphore.Verify(s => s.Dispose(), Times.Once);
    }
}
