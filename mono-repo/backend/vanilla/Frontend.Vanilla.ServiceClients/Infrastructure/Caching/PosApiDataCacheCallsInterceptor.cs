#nullable enable

using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.ServiceClients.Infrastructure.Diagnostics;

namespace Frontend.Vanilla.ServiceClients.Infrastructure.Caching;

/// <summary>
/// Intercepts calls to underlying <see cref="IPosApiDataCache" /> by storing them to <see cref="InterceptedCacheCalls" /> for later usage in <see cref="PosApiCachedDataDiagnosticProvider"/>.
/// </summary>
internal sealed class PosApiDataCacheCallsInterceptor(IPosApiDataCache inner, InterceptedCacheCalls interceptedCacheCalls) : PosApiDataCacheBase
{
    public override Task<Wrapper<T>?> GetAsync<T>(ExecutionMode mode, PosApiDataType dataType, RequiredString key)
    {
        interceptedCacheCalls.Add(dataType, key, typeof(T));

        return inner.GetAsync<T>(mode, dataType, key);
    }

    public override Task SetAsync(ExecutionMode mode, PosApiDataType dataType, RequiredString key, object value, TimeSpan? relativeExpiration)
        => inner.SetAsync(mode, dataType, key, value, relativeExpiration);

    public override Task RemoveAsync(ExecutionMode mode, PosApiDataType dataType, RequiredString key)
        => inner.RemoveAsync(mode, dataType, key);

    public override Task<T> GetOrCreateAsync<T>(
        ExecutionMode mode,
        PosApiDataType dataType,
        RequiredString key,
        Func<Task<T>> valueFactory,
        bool cached,
        TimeSpan? relativeExpiration)
    {
        interceptedCacheCalls.Add(dataType, key, typeof(T));

        return inner.GetOrCreateAsync(mode, dataType, key, valueFactory, cached, relativeExpiration);
    }
}
