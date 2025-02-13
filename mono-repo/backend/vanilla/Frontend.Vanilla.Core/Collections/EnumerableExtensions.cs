using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Runtime.CompilerServices;
using Frontend.Vanilla.Core.Patterns;

namespace Frontend.Vanilla.Core.Collections;

/// <summary>
/// Extension methods for <see cref="IEnumerable{T}" />.
/// </summary>
public static class EnumerableExtensions
{
    /// <summary>Creates a dictionary from this enumerable sequence of key-value pairs.</summary>
    public static Dictionary<TKey, TValue> ToDictionary<TKey, TValue>(this IEnumerable<KeyValuePair<TKey, TValue>> enumerable, IEqualityComparer<TKey>? comparer = null)
        where TKey : notnull
        => CreateDictionary(enumerable, comparer, capacity: (enumerable as ICollection<KeyValuePair<TKey, TValue>>)?.Count);

    /// <summary>Creates a dictionary from this enumerable sequence of tuples.</summary>
    internal static Dictionary<TKey, TValue> ToDictionary<TKey, TValue>(this IEnumerable<(TKey Key, TValue Value)> tuples, IEqualityComparer<TKey>? comparer = null)
        where TKey : notnull
        => CreateDictionary(tuples.Select(t => KeyValue.Get(t.Key, t.Value)), comparer, capacity: (tuples as ICollection<(TKey, TValue)>)?.Count);

    internal static Dictionary<TKey, TSource> ToDictionary<TSource, TKey>(
        this IEnumerable<TSource> source,
        Func<TSource, TKey> keySelector,
        IEqualityComparer<TKey>? comparer = null)
        where TKey : notnull
        => CreateDictionary(source.Select(x => KeyValue.Get(keySelector(x), x)), comparer, capacity: (source as ICollection<TSource>)?.Count);

    /// <summary>Own impl b/c old .NET Framework doesn't include duplicate key in the exception message. Remove once migrated to .NET Core.</summary>
    private static Dictionary<TKey, TValue> CreateDictionary<TKey, TValue>(
        IEnumerable<KeyValuePair<TKey, TValue>> enumerable,
        IEqualityComparer<TKey>? comparer,
        int? capacity)
        where TKey : notnull
        => new Dictionary<TKey, TValue>(capacity ?? 0, comparer) { enumerable };

    /// <summary>Returns distinct elements from this enumerable sequence based on equality comparison provided via a lambda function.</summary>
    public static IEnumerable<TValue> Distinct<TValue, TMember>(this IEnumerable<TValue> input, Func<TValue, TMember> selector)
        => input.Distinct(new LambdaEqualityComparer<TValue, TMember>(selector));

    /// <summary>Executes the specified <paramref name="action" /> for each element of this enumerable sequence.</summary>
    public static void Each<TValue>(this IEnumerable<TValue> enumerable, Action<TValue> action)
    {
        foreach (var item in enumerable)
            action(item);
    }

    /// <summary>Executes the specified <paramref name="action" /> for each element of this enumerable sequence providing its index too.</summary>
    public static void Each<TValue>(this IEnumerable<TValue> enumerable, Action<TValue, int> action)
    {
        var index = 0;
        foreach (var item in enumerable)
            action(item, index++);
    }

    /// <summary>Returns empty sequence if this one is null. Otherwise returns this one. Hhandy for chaining so that you don't need to specify generic parameters.</summary>
    public static IEnumerable<T> NullToEmpty<T>(this IEnumerable<T>? enumerable)
        => enumerable ?? Array.Empty<T>();

    /// <summary>Returns empty collection if this one is null. Otherwise returns this one. Hhandy for chaining so that you don't need to specify generic parameters.</summary>
    public static IReadOnlyList<T> NullToEmpty<T>(this IReadOnlyList<T>? collection)
        => collection ?? Array.Empty<T>();

    internal static IEnumerable<T> WhereNotNull<T>(this IEnumerable<T?> items)
        where T : class
        => (IEnumerable<T>)items.Where(i => i != null);

    /// <summary>Shortcut for <see cref="string.Join{T}(string,IEnumerable{T})" />.</summary>
    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public static string Join<T>(this IEnumerable<T> values, string separator = ", ")
        => string.Join(separator, values);

    /// <summary>Shortcut for <see cref="string.Concat{T}(IEnumerable{T})" />.</summary>
    public static string Concat<T>(this IEnumerable<T> values)
        => string.Concat(values);

    /// <summary>Convenient method on top of LINQ.</summary>
    public static IEnumerable<T> Append<T>(this IEnumerable<T> enumerable, params T[] itemsToAppend)
        => enumerable.Concat(itemsToAppend);

    /// <summary>Convenient method on top of LINQ.</summary>
    public static IEnumerable<T> Prepend<T>(this IEnumerable<T> enumerable, params T[] itemsToPrepend)
        => itemsToPrepend.Concat(enumerable);

    /// <summary>Convenient method on top of LINQ.</summary>
    public static IEnumerable<T> Except<T>(this IEnumerable<T> enumerable, params T[] itemsToExclude)
        => Enumerable.Except(enumerable, itemsToExclude);

    internal static bool IsNullOrEmpty<T>([NotNullWhen(false)] this IEnumerable<T>? enumerable)
        => enumerable == null || !enumerable.Any();

    internal static bool IsNullOrEmpty<T>([NotNullWhen(false)] this IReadOnlyCollection<T>? enumerable)
        => enumerable == null || enumerable.Count == 0;

    /// <summary>
    /// Gets debug string of items in the enumerable.
    /// Useful when you want to write items to log.
    /// If no items then returns '(empty)'.
    /// If one item then returns item itself.
    /// Otherwise returns items prefixed with their index (one-based) joined by new line.
    /// Nulls are replaced with '(null)'.
    /// </summary>
    public static string ToDebugString<T>(this IEnumerable<T> enumerable)
    {
        var col = enumerable as IReadOnlyCollection<T> ?? enumerable.ToList();

        switch (col.Count)
        {
            case 0:
                return "(empty)";
            case 1:
                return col.First()?.ToString() ?? "(null)";
            default:
                return col.ConvertAll((item, index) => $"{index + 1}) {item?.ToString() ?? "(null)"}").Join(Environment.NewLine);
        }
    }

    /// <summary>Useful when you just want to enumerate the collection without copying and storing it.</summary>
    internal static IReadOnlyList<T> Enumerate<T>(this IEnumerable<T> enumerable)
        => enumerable as IReadOnlyList<T> ?? enumerable.ToList();

    internal static bool SequenceEqual<T>(this IEnumerable<T> first, params T[] second)
        => first.SequenceEqual(second, null);
}
