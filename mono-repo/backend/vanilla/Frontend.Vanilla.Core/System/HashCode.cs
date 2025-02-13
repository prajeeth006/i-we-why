using System.Collections.Generic;
using System.Linq;

namespace Frontend.Vanilla.Core.System;

/// <summary>
/// Uses ValueTuple for combining hash codes.
/// Inspired by <see href="https://docs.microsoft.com/en-us/dotnet/api/system.hashcode?view=netcore-2.2" />.
/// </summary>
internal static class HashCode
{
    // Don't use params to avoid allocation of a new array b/c GetHashCode must be fast!!
    public static int Combine<T1, T2>(T1 arg1, T2 arg2)
        => (arg1, arg2).GetHashCode();

    public static int Combine<T1, T2, T3>(T1 arg1, T2 arg2, T3 arg3)
        => (arg1, arg2, arg3).GetHashCode();

    public static int Combine<T>(IEnumerable<T> items)
        => items.Aggregate(seed: 0, Combine);

    public static int CombineIgnoreOrder<T1, T2>(T1 arg1, T2 arg2)
        => (arg1?.GetHashCode() ?? 0) ^ (arg2?.GetHashCode() ?? 0); // Xor b/c it isn't influenced by order

    public static int CombineIgnoreOrder<T>(IEnumerable<T> items)
        => items.Aggregate(seed: 0, CombineIgnoreOrder);
}
