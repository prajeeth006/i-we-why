using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Reflection;

namespace Frontend.Vanilla.Core.System;

/// <summary>
/// Provides strongly-typed utilities for enum types.
/// </summary>
internal static class Enum<T>
    where T : Enum
{
    public static ReadOnlySet<T> Values { get; }

    private static readonly ReadOnlySet<T>? FlagCombinationsValue;
    public static ReadOnlySet<T> FlagCombinations => FlagCombinationsValue ?? throw new Exception($"{typeof(T)} is not [Flags] enum type.");

    static Enum()
    {
        if (!typeof(T).IsEnum)
            throw new Exception($"{typeof(T)} is not an enum type.");

        Values = Enum.GetValues(typeof(T))
            .Cast<T>()
            .ToHashSet()
            .AsReadOnly();

        if (!typeof(T).Has<FlagsAttribute>())
            return;

        var int32Values = Values.Select(v => ((IConvertible)v).ToInt32(null));
        FlagCombinationsValue = GetCombinations(int32Values.GetEnumerator())
            .Select(v => (T)Enum.ToObject(typeof(T), v))
            .ToHashSet()
            .AsReadOnly();
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public static T Parse(string value, bool ignoreCase = false)
        => (T)Enum.Parse(typeof(T), value, ignoreCase);

    private static IEnumerable<int> GetCombinations(IEnumerator<int> enumerator)
    {
        if (!enumerator.MoveNext())
            yield break;

        var current = enumerator.Current;

        yield return current;

        foreach (var other in GetCombinations(enumerator))
        {
            yield return other;

            if (current != 0 && other != 0 && current != other)
                yield return current | other;
        }
    }
}
