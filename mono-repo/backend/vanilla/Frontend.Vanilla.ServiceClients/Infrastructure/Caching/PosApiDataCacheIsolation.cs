#nullable enable

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.ServiceClients.Infrastructure.Caching;

/// <summary>
/// Decorates <see cref="PosApiDataCacheBase" />. Cache keys are automatically extended
/// to include <see cref="ServiceClientsConfiguration.Headers" /> because the return data from PosAPI vary depending on them.
/// However <see cref="ServiceClientsConfiguration.AccessId" /> isn't included because it's unique for each product
/// hence no data would be shared across products of the label which improves the performance.
/// </summary>
internal sealed class PosApiDataCacheIsolation(IPosApiDataCache inner, IServiceClientsConfiguration config) : PosApiDataCacheBase
{
    public override Task<Wrapper<T>?> GetAsync<T>(ExecutionMode mode, PosApiDataType dataType, RequiredString key)
        => inner.GetAsync<T>(mode, dataType, GetFullCacheKey(key));

    public override Task SetAsync(ExecutionMode mode, PosApiDataType dataType, RequiredString key, object value, TimeSpan? relativeExpiration)
        => inner.SetAsync(mode, dataType, GetFullCacheKey(key), value, relativeExpiration);

    public override Task RemoveAsync(ExecutionMode mode, PosApiDataType dataType, RequiredString key)
        => inner.RemoveAsync(mode, dataType, GetFullCacheKey(key));

    public override Task<T> GetOrCreateAsync<T>(
        ExecutionMode mode,
        PosApiDataType dataType,
        RequiredString key,
        Func<Task<T>> valueFactory,
        bool cached = true,
        TimeSpan? relativeExpiration = null)
        => inner.GetOrCreateAsync(mode, dataType, GetFullCacheKey(key), valueFactory, cached, relativeExpiration);

    private string GetFullCacheKey(RequiredString key)
    {
        Guard.NotNull(key, nameof(key));

        var headers = config.Headers
            .Select(h => KeyValue.Get(h.Key.ToLowerInvariant(), h.Value))
            .SelectMany(h => ToNonEmptyArray(h.Value).Select(v => KeyValue.Get(h.Key, v)))
            .OrderBy(h => h.Key)
            .ThenBy(h => h.Value)
            .Select(h => $"[{h.Key}={h.Value}]")
            .Concat();

        return $"{key}{headers}";
    }

    private static string?[] ToNonEmptyArray(IReadOnlyList<string> strs)
        => strs.Count > 0 ? strs.ToArray() : new string?[] { null };
}
