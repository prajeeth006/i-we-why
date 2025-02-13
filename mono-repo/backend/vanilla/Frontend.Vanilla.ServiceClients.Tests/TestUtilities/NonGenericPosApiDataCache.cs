#nullable enable

using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.Caching;

namespace Frontend.Vanilla.ServiceClients.Tests.TestUtilities;

internal abstract class NonGenericPosApiDataCache : PosApiDataCacheBase
{
    public abstract Task<Wrapper<object>?> GetAsync(Type resultType, ExecutionMode mode, PosApiDataType dataType, RequiredString key);

    public sealed override async Task<Wrapper<T>?> GetAsync<T>(ExecutionMode mode, PosApiDataType dataType, RequiredString key)
    {
        var entry = await GetAsync(typeof(T), mode, dataType, key);

        return entry.IfNotNull(e => new Wrapper<T>((T)e.Value));
    }

    public abstract Task<object> GetOrCreateAsync(
        ExecutionMode mode,
        PosApiDataType dataType,
        RequiredString key,
        Type resultType,
        Func<Task<object>> valueFactory,
        bool cached,
        TimeSpan? relativeExpiration);

    public sealed override async Task<T> GetOrCreateAsync<T>(
        ExecutionMode mode,
        PosApiDataType dataType,
        RequiredString key,
        Func<Task<T>> valueFactory,
        bool cached,
        TimeSpan? relativeExpiration)
        => (T)await GetOrCreateAsync(mode, dataType, key, typeof(T), async () => await valueFactory(), cached, relativeExpiration);
}
