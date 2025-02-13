using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.WebIntegration.Configuration.DynaCon;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.ClientConfig;

public class FilterUnwantedForCorsClientConfigMergerExecutorDecoratorTests
{
    private FilterUnwantedForCorsClientConfigMergerExecutorDecorator target;
    private Mock<IClientConfigMergeExecutor> inner;
    private Mock<IHttpContextAccessor> httpContextAccessor;
    private CancellationToken ct;
    private HeaderDictionary headers;
    private Mock<IClientConfigProvider> provider1;
    private Mock<IDynaConParameterExtractor> dynaconParameterExtractor;

    public FilterUnwantedForCorsClientConfigMergerExecutorDecoratorTests()
    {
        headers = new HeaderDictionary();
        httpContextAccessor = new Mock<IHttpContextAccessor>();
        httpContextAccessor.Setup(h => h.HttpContext.Request.Host).Returns(new HostString("sports.bwin.com", 66));
        httpContextAccessor.Setup(h => h.HttpContext.Request.Headers).Returns(headers);
        inner = new Mock<IClientConfigMergeExecutor>();
        provider1 = new Mock<IClientConfigProvider>();
        dynaconParameterExtractor = new Mock<IDynaConParameterExtractor>();
        dynaconParameterExtractor.SetupGet(d => d.Product).Returns("sports");
        target = new FilterUnwantedForCorsClientConfigMergerExecutorDecorator(inner.Object, httpContextAccessor.Object, dynaconParameterExtractor.Object);

        ct = TestCancellationToken.Get();
    }

    [Fact]
    public async Task ShouldFilterOutVanillaConfigsWhenRequestHostDoesntMatchCorsOriginHost()
    {
        headers.Add("Origin", "http://www.bwin.com/");

        target.IgnoreProvidersFromAssemblyForCorsRequests(typeof(LambdaClientConfigProvider).Assembly.GetName().Name);

        var providers = new[]
        {
            provider1.Object, new LambdaClientConfigProvider("test",
                () => new
                {
                    test = "x",
                }),
        };
        var result = new Dictionary<string, object>();

        inner.Setup(e => e.ExecuteAsync(It.Is<IEnumerable<IClientConfigProvider>>(p => p.Count() == 1 && p.First() == provider1.Object), ct)).ReturnsAsync(result);

        var config = await target.ExecuteAsync(providers, ct);

        config.Should().BeSameAs(result);
    }

    [Fact]
    public async Task ShouldNotFilterOutMicroComponentConfigs()
    {
        headers.Add("Origin", "http://www.bwin.com/");

        target.IgnoreProvidersFromAssemblyForCorsRequests(typeof(LambdaClientConfigProvider).Assembly.GetName().Name);

        var providers = new[] { provider1.Object, new TestClientConfigProvider() };
        var result = new Dictionary<string, object>();

        inner.Setup(e => e.ExecuteAsync(It.Is<IEnumerable<IClientConfigProvider>>(p => p.Count() == 2), ct)).ReturnsAsync(result);

        var config = await target.ExecuteAsync(providers, ct);

        config.Should().BeSameAs(result);
    }

    private class TestClientConfigProvider : LambdaClientConfigProvider
    {
        public override ClientConfigType Type => ClientConfigType.Lazy;

        public TestClientConfigProvider()
            : base("test", () => new { test = "x" }) { }
    }
}
