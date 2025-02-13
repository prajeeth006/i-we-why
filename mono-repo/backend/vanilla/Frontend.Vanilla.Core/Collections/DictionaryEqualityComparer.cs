using System.Collections.Generic;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.Core.Collections;

/// <summary>
/// Determines if two dictionaries contain equal items regardless of their order.
/// </summary>
internal sealed class DictionaryEqualityComparer<TKey, TValue> : ReferenceTypeEqualityComparer<IReadOnlyDictionary<TKey, TValue>>
{
    public static IEqualityComparer<IReadOnlyDictionary<TKey, TValue>?> Singleton { get; } = new DictionaryEqualityComparer<TKey, TValue>();

    private DictionaryEqualityComparer() { }

    public override bool EqualsCore(IReadOnlyDictionary<TKey, TValue> x, IReadOnlyDictionary<TKey, TValue> y)
    {
        if (x.Count != y.Count)
            return false;

        foreach (var xPair in x)
            if (!y.TryGetValue(xPair.Key, out var yVal) || !Equals(xPair.Value, yVal))
                return false;

        return true;
    }

    public override int GetHashCode(IReadOnlyDictionary<TKey, TValue> obj)
        => obj.Count.GetHashCode();
}
