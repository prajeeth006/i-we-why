#nullable enable

using System;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Caching;
using Frontend.Vanilla.Core.Caching.Isolation;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.ServiceClients.Security;
using Microsoft.Extensions.Caching.Memory;

namespace Frontend.Vanilla.ServiceClients.Infrastructure;

/// <summary>
/// Use semaphores to allow only one retrieval (mostly HTTP request) for particular data at time,
/// first call makes the request, subsequent calls wait and will get cached value
/// e.g. one req for currencies, one req for segmentation groups of current user.
/// Because lock() isn't async so we use semaphores.
/// Store semaphores in cache -> they expire -> avoids memory leak if keys don't ever reoccur b/c of their uniqueness e.g. session token.
/// </summary>
internal interface IPosApiRequestSemaphores
{
    Task<IDisposable> WaitDisposableAsync(ExecutionMode mode, PosApiDataType dataType, RequiredString key);
}

internal sealed class PosApiRequestSemaphores(ILabelIsolatedMemoryCache memoryCache, ICurrentUserAccessor currentUserAccessor) : IPosApiRequestSemaphores
{
    private readonly object creationLock = new object();

    public Task<IDisposable> WaitDisposableAsync(ExecutionMode mode, PosApiDataType dataType, RequiredString key)
    {
        var authTokens = dataType == PosApiDataType.User ? currentUserAccessor.User.GetRequiredPosApiAuthTokens() : null;
        var semaphoreCacheKey = $"PosApiLocks:{dataType}:{authTokens?.SessionToken}:{key}";
        var semaphore = memoryCache.GetOrCreate(semaphoreCacheKey, creationLock, CreateSemaphore);

        return semaphore.WaitDisposableAsync(mode);
    }

    private static SemaphoreSlim CreateSemaphore(ICacheEntry cacheEntry)
    {
        cacheEntry.SlidingExpiration = TimeSpan.FromMinutes(1);
        cacheEntry.Priority = CacheItemPriority.Low;

        return new SemaphoreSlim(initialCount: 1, maxCount: 1);
    }
}
