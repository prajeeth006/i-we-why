using System;
using System.Collections.Generic;

namespace Frontend.Vanilla.Core.Collections;

/// <summary>
/// Lazily gets enumerable and then enumerates it. Useful if a method returning whole collection is heavy and may not be needed.
/// </summary>
internal static class LazyEnumerable
{
    public static IEnumerable<T> Get<T>(Func<IEnumerable<T>> factory)
    {
        foreach (var item in factory())
            yield return item;
    }
}
