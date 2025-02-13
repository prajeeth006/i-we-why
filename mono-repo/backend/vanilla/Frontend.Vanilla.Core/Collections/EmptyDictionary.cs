using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace Frontend.Vanilla.Core.Collections;

/// <summary>Singleton instance of a dictionary which is empty.</summary>
public static class EmptyDictionary<TKey, TValue>
    where TKey : notnull
{
    /// <summary>Singleton instance of a dictionary which is empty.</summary>
    public static readonly ReadOnlyDictionary<TKey, TValue> Singleton = new (new Dictionary<TKey, TValue>());
}
