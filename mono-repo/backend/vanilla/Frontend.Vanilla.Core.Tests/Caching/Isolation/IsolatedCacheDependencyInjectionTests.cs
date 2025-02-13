using System;
using Frontend.Vanilla.Core.Caching.Isolation;
using Frontend.Vanilla.Core.Configuration;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Caching.Isolation;

public class IsolatedCacheDependencyInjectionTests
{
    private ServiceCollection services;
    private Mock<IMemoryCache> defaultMemoryCache;
    private Mock<IDistributedCache> defaultDistributedCache;
    private Mock<IEnvironmentProvider> envProvider;

    public IsolatedCacheDependencyInjectionTests()
    {
        defaultMemoryCache = new Mock<IMemoryCache>();
        defaultDistributedCache = new Mock<IDistributedCache>();
        envProvider = new Mock<IEnvironmentProvider>();
        services = new ServiceCollection();

        services.AddSingleton(defaultMemoryCache.Object);
        services.AddSingleton(defaultDistributedCache.Object);
        envProvider.SetupGet(e => e.CurrentLabel).Returns("bwin.xxx");

        // Act
        services.AddLabelIsolatedMemoryCache();
        services.AddLabelIsolatedDistributedCache();
    }

    private T Get<T>() => services.BuildServiceProvider().GetService<T>();

    [Fact]
    public void MemoryCache_ShouldCreateIsolatedCache()
    {
        services.AddSingleton(envProvider.Object);

        // Act
        Get<ILabelIsolatedMemoryCache>().Remove("key");

        defaultMemoryCache.Verify(c => c.Remove(new Tuple<object, object>("bwin.xxx", "key")));
    }

    [Fact]
    public void MemoryCache_ShouldReturnSameCache_IfNoEnvironmentProvider()
    {
        // Act
        Get<ILabelIsolatedMemoryCache>().Remove("key");

        defaultMemoryCache.Verify(c => c.Remove("key"));
    }

    [Fact]
    public void DistributedCache_ShouldCreateIsolatedCache()
    {
        services.AddSingleton(envProvider.Object);

        // Act
        Get<ILabelIsolatedDistributedCache>().Remove("key");

        defaultDistributedCache.Verify(c => c.Remove("bwin.xxx:key"));
    }

    [Fact]
    public void DistributedCache_ShouldReturnSameCache_IfNoEnvironmentProvider()
    {
        // Act
        Get<ILabelIsolatedDistributedCache>().Remove("key");

        defaultDistributedCache.Verify(c => c.Remove("key"));
    }
}
