using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.ServiceClients.Services.Authentication;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.ClientConfig;

public class RefreshClaimsClientConfigMergeExecutorTests
{
    private IClientConfigMergeExecutor target;
    private Mock<IClientConfigMergeExecutor> inner;
    private Mock<ICachedUserValuesFlag> cachedUserValuesFlag;
    private Mock<IPosApiAuthenticationService> posApiAuthenticationService;
    private Mock<IHttpContextAccessor> httpContextAccessor;

    private List<IClientConfigProvider> providers;
    private CancellationToken ct;
    private IReadOnlyDictionary<string, object> testConfig;

    public RefreshClaimsClientConfigMergeExecutorTests()
    {
        inner = new Mock<IClientConfigMergeExecutor>();
        cachedUserValuesFlag = new Mock<ICachedUserValuesFlag>();
        posApiAuthenticationService = new Mock<IPosApiAuthenticationService>();
        httpContextAccessor = new Mock<IHttpContextAccessor>();
        target = new RefreshClaimsClientConfigMergeExecutor(inner.Object, cachedUserValuesFlag.Object, posApiAuthenticationService.Object, httpContextAccessor.Object);

        providers = new List<IClientConfigProvider> { Mock.Of<IClientConfigProvider>(c => c.Type == ClientConfigType.Eager) };
        ct = TestCancellationToken.Get();
        testConfig = Mock.Of<IReadOnlyDictionary<string, object>>();
        httpContextAccessor.SetupGet(r => r.HttpContext.Request.Headers).Returns(new HeaderDictionary());
    }

    [Fact]
    public async Task ShouldRefreshClaimsBeforeProviders_IfCachedIsFalseAndNotPostLoginCall()
    {
        var executed = new List<string>();
        inner.Setup(i => i.ExecuteAsync(providers, ct)).Returns(async () =>
        {
            await Task.Yield();
            executed.Add("Inner");

            return testConfig;
        });
        posApiAuthenticationService.Setup(s => s.RefreshClaimsAsync(ct)).Returns(async () =>
        {
            await Task.Yield();
            executed.Add("RefreshClaims");
        });

        // Act
        var config = await target.ExecuteAsync(providers, ct);

        config.Should().BeSameAs(testConfig);
        executed.Should().Equal("RefreshClaims", "Inner");
    }

    [Fact]
    public async Task ShouldNoRefreshClaimsBeforeProviders_IfCalledIsMadeAsPartOfLoginProcess()
    {
        httpContextAccessor.SetupGet(r => r.HttpContext.Request.Headers).Returns(new HeaderDictionary { { "x-reload-on-login", "1" } });
        var executed = new List<string>();
        inner.Setup(i => i.ExecuteAsync(providers, ct)).Returns(async () =>
        {
            await Task.Yield();
            executed.Add("Inner");

            return testConfig;
        });
        posApiAuthenticationService.Setup(s => s.RefreshClaimsAsync(ct)).Returns(async () =>
        {
            await Task.Yield();
            executed.Add("RefreshClaims");
        });

        // Act
        var config = await target.ExecuteAsync(providers, ct);

        config.Should().BeSameAs(testConfig);
        executed.Should().Equal("Inner");
    }

    [Fact]
    public async Task ShouldNotRefreshClaims_IfCachedIsTrue()
    {
        inner.Setup(i => i.ExecuteAsync(providers, ct)).ReturnsAsync(testConfig);
        cachedUserValuesFlag.Setup(f => f.GetCached(ct)).Returns(Task.FromResult(true));

        // Act
        var config = await target.ExecuteAsync(providers, ct);

        config.Should().BeSameAs(testConfig);
        posApiAuthenticationService.VerifyWithAnyArgs(s => s.RefreshClaimsAsync(TestContext.Current.CancellationToken), Times.Never);
    }
}
