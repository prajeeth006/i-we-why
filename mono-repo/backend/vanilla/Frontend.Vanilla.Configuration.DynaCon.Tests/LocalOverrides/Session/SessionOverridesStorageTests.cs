using System;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.LocalOverrides;
using Frontend.Vanilla.Configuration.DynaCon.LocalOverrides.Session;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.Extensions.Caching.Memory;
using Moq;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.LocalOverrides.Session;

public class SessionOverridesStorageTests
{
    private readonly IOverridesStorage target;
    private readonly Mock<IDynaConOverridesSessionIdentifier> sessionIdentifier;
    private readonly TestMemoryCache memoryCache;

    public SessionOverridesStorageTests()
    {
        sessionIdentifier = new Mock<IDynaConOverridesSessionIdentifier>();
        memoryCache = new TestMemoryCache();
        target = new SessionOverridesStorage(sessionIdentifier.Object, memoryCache);

        sessionIdentifier.Setup(i => i.Value).Returns("s-id");
    }

    [Fact]
    public void CurrentContextId_ShouldBeNullWhenNothingInCacheEvenIfSessionIdentifierExists()
    {
        target.CurrentContextId.Should().BeNull();
    }

    [Fact]
    public void Set_ShouldSetOverridesToCache()
    {
        var overrides = JObject.Parse("{ Test: 123 }");

        // Act
        target.Set(overrides);
        var watcher = target.WatchChanges();
        var result = target.Get();
        overrides.Add("Other", 456); // Should be copied on set
        var result2 = target.Get();

        watcher.HasChanged.Should().BeFalse();
        result.Should().BeJson("{ Test: 123 }");
        result2.Should().NotBeSameAs(result, "should be copied each time")
            .And.BeJson(result);
        sessionIdentifier.Verify(i => i.Create(), Times.Never);
        VerifyCacheKey("s-id");
    }

    [Fact]
    public void Set_ShouldCreateNewId()
    {
        sessionIdentifier.Setup(i => i.Value).Returns(() => null);
        sessionIdentifier.Setup(i => i.Create()).Returns("new-id");

        // Act
        target.Set(JObject.Parse("{ Test: 123 }"));

        sessionIdentifier.Verify(i => i.Create(), Times.Once);
        VerifyCacheKey("new-id");
    }

    [RetryFact]
    public void Set_ShouldExpireOverrides()
        => RunEvictionTest(act: () =>
        {
            memoryCache.Clock.UtcNow += OverridesConfigurationContainerDecorator.RelativeExpiration.Multiply(5);
            memoryCache.Get("trigger-cache-cleanup");
        });

    [RetryFact]
    public void Set_ShouldSignalOverwrite()
        => RunEvictionTest(act: () => target.Set(JObject.Parse("{ Test: 456 }")));

    private void RunEvictionTest(Action act)
    {
        target.Set(JObject.Parse("{ Test: 123 }"));
        var watcher = target.WatchChanges();

        // Act
        target.Set(JObject.Parse("{ Test: 456 }"));

        Task.Delay(1000).Wait();
        watcher.HasChanged.Should().BeTrue();
    }

    [Fact]
    public void WatchChanges_ShouldThrow_IfNoSession_ButCalled()
    {
        sessionIdentifier.Setup(i => i.Value).Returns(() => null);
        new Action(() => target.WatchChanges()).Should().Throw();
    }

    [Fact]
    public void Get_ShouldReturnEmpty_IfNoSession()
    {
        sessionIdentifier.Setup(i => i.Value).Returns(() => null);
        target.Get().Should().BeEmpty();
    }

    private void VerifyCacheKey(TrimmedRequiredString expected)
        => memoryCache.CreatedEntries.Single().Key.Should().BeOfType<Tuple<object, object>>().Which.Item2.Should().Be(expected);
}
