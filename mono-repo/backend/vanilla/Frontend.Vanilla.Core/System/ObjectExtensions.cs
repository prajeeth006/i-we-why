using System;
using System.Collections.Generic;
using System.Linq;

namespace Frontend.Vanilla.Core.System;

internal static class ObjectExtensions
{
    public static bool EqualsAny<T>(this T value, params T[] comparedValues)
        => value.EqualsAny(comparedValues, null);

    public static bool EqualsAny<T>(this T value, IEnumerable<T> comparedValues, IEqualityComparer<T>? comparer = null)
        => comparedValues.Contains(value, comparer);

    public static TResult? IfNotNull<TValue, TResult>(this TValue? value, Func<TValue, TResult> convert)
        where TValue : class
        where TResult : class
        => value != null ? convert(value) : null;

    public static TResult? IfNotNull<TValue, TResult>(this TValue? value, Func<TValue, TResult> convert)
        where TValue : struct
        where TResult : struct
        => value != null ? convert(value.Value) : null;

    /// <summary>Generic helper for fluent syntax.</summary>
    public static T If<T>(this T obj, bool condition, Action<T> action)
    {
        if (condition) action(obj);

        return obj;
    }
}
