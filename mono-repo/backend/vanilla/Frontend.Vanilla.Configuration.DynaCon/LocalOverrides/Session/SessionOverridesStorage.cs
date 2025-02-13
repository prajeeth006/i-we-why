using System;
using System.Threading;
using Frontend.Vanilla.Core.Caching.Isolation;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Configuration.DynaCon.LocalOverrides.Session;

/// <summary>
/// Stores config overrides in memory cache per each user session.
/// </summary>
internal sealed class SessionOverridesStorage(IDynaConOverridesSessionIdentifier sessionIdentifier, IMemoryCache memoryCache) : IOverridesStorage
{
    private readonly IMemoryCache memoryCache = memoryCache.IsolateBy("Van:Config:SessionOverrides");

    public TrimmedRequiredString? CurrentContextId => GetCachedValue() != null ? sessionIdentifier.Value : null;

    public IChangeToken WatchChanges()
    {
        var cached = GetRequiredCachedValue();

        return cached.ChangeToken;
    }

    public JObject Get()
    {
        var cached = GetCachedValue();

        return cached != null
            ? JObject.Parse(cached.OverridesJson) // Copy to keep inner state intact b/c JObject is mutable
            : new JObject();
    }

    private CachedValue GetRequiredCachedValue()
    {
        var value = GetCachedValue();

        return value ?? throw new Exception(
            $"Your config overrides associated with id '{sessionIdentifier.Value}' expired. So start a new session e.g. delete cookies."); // Make it explicit for user
    }

    private CachedValue? GetCachedValue()
    {
        return sessionIdentifier.Value == null ? null : memoryCache.Get<CachedValue>(sessionIdentifier.Value);
    }

    public void Set(JObject overridesJson)
    {
        var id = sessionIdentifier.Value ?? sessionIdentifier.Create();
        var evictionSource = new CancellationTokenSource();

        memoryCache.CreateEntry(id)
            .SetValue(new CachedValue(overridesJson.ToString(), evictionSource.GetChangeToken())) // Copy to isolate inner state b/c JObject is mutable
            .SetSlidingExpiration(OverridesConfigurationContainerDecorator.RelativeExpiration.Multiply(3))
            .RegisterPostEvictionCallback((_, _, _, _) => evictionSource.Cancel())
            .Dispose();
    }

    private sealed class CachedValue(string overridesJson, IChangeToken changeToken)
    {
        public string OverridesJson { get; } = overridesJson;
        public IChangeToken ChangeToken { get; } = changeToken;
    }
}
