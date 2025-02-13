#nullable enable

using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Collections;

namespace Frontend.Vanilla.Content.Loading;

/// <summary>
/// Explicitly stores main content from Sitecore with prefetched ones.
/// </summary>
internal sealed class WithPrefetched<T>(T requested, IEnumerable<T>? prefetched = null, TimeSpan relativeExpiration = default)
{
    public T Requested { get; } = requested;
    public IReadOnlyList<T> Prefetched { get; } = (prefetched?.ToList()).NullToEmpty();
    public TimeSpan RelativeExpiration { get; } = relativeExpiration;
}
