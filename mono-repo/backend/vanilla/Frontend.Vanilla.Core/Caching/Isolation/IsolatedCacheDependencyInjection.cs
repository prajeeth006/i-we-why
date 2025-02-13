using System;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Reflection;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Hybrid;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Core.Caching.Isolation;

/// <summary>
/// An instance of <see cref="IMemoryCache" /> in which cache keys are automatically
/// extended by <see cref="IEnvironmentProvider.CurrentLabel" /> to isolate entries between labels.
/// </summary>
public interface ILabelIsolatedMemoryCache : IMemoryCache { }

/// <summary>
/// An instance of <see cref="IDistributedCache" /> in which cache keys are automatically
/// extended by <see cref="IEnvironmentProvider.CurrentLabel" /> to isolate entries between labels.
/// </summary>
public interface ILabelIsolatedDistributedCache : IDistributedCache { }

/// <summary>
/// An instance of <see cref="HybridCache" /> in which cache keys are automatically
/// extended by <see cref="IEnvironmentProvider.CurrentLabel" /> to isolate entries between labels.
/// </summary>
public sealed class LabelIsolatedHybridCache(HybridCache inner, IEnvironmentProvider environmentProvider) : IsolatedHybridCache(inner, _ => environmentProvider.CurrentLabel) { }

internal static class IsolatedCacheDependencyInjection
{
    public static void AddLabelIsolatedMemoryCache(this IServiceCollection services)
        => services.AddLabelIsolatedCache<ILabelIsolatedMemoryCache, IMemoryCache>(
            (cache, environmentProvider) => cache.IsolateBy(_ => environmentProvider.CurrentLabel.Value));

    public static void AddLabelIsolatedDistributedCache(this IServiceCollection services)
        => services.AddLabelIsolatedCache<ILabelIsolatedDistributedCache, IDistributedCache>(
            (cache, environmentProvider) => cache.IsolateBy(_ => environmentProvider.CurrentLabel + ":"));

    public static void AddLabelIsolatedHybridCache(this IServiceCollection services)
        => services.AddSingleton<LabelIsolatedHybridCache>();

    private static void AddLabelIsolatedCache<TTarget, TSource>(this IServiceCollection services, Func<TSource, IEnvironmentProvider, TSource> isolate)
        where TSource : class
        where TTarget : class, TSource
        => services.AddExtendedSingleton<TTarget, TSource>(provider =>
        {
            var cache = provider.GetRequiredService<TSource>();
            var environmentProvider = provider.GetService<IEnvironmentProvider>();

            return environmentProvider != null ? isolate(cache, environmentProvider) : cache;
        });
}
