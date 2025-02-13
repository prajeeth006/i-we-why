using System;
using System.Linq;
using System.Threading;
using FluentAssertions;
using Frontend.Vanilla.Core.Caching;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Microsoft.Extensions.Caching.Memory;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Caching;

public class MemoryCacheLockingExtensionsTests
{
    private TestMemoryCache target;
    private object factoryLock;
    private Mock<Func<ICacheEntry, string>> factory;

    public MemoryCacheLockingExtensionsTests()
    {
        target = new TestMemoryCache();
        factoryLock = new object();
        factory = new Mock<Func<ICacheEntry, string>>();
    }

    [Fact]
    public void ShouldReturnCachedValue_IfExists()
    {
        target.Set("key", "cached");

        var result = target.GetOrCreate("key", factoryLock, factory.Object); // Act

        result.Should().Be("cached");
        factory.VerifyWithAnyArgs(f => f(null), Times.Never);
    }

    [Fact]
    public void ShouldExecuteFactory_IfNothingCached_AllowingSingleFactoryExecution()
    {
        var hasLocked = false;
        factory.SetupWithAnyArgs(f => f(null)).Returns<ICacheEntry>(
            e =>
            {
                e.SlidingExpiration = new TimeSpan(666);
                hasLocked = Monitor.IsEntered(factoryLock);

                return "new";
            });

        var result = target.GetOrCreate("key", factoryLock, factory.Object); // Act

        result.Should().Be("new");
        hasLocked.Should().BeTrue();
        target.CreatedEntries.Single().SlidingExpiration.Should().Be(new TimeSpan(666));
    }
}
