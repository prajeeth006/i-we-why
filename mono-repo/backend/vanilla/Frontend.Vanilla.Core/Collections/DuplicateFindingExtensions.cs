using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Frontend.Vanilla.Core.Expressions;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Collections;

/// <summary>
/// Extension methods for handling duplicates in the collection.
/// </summary>
internal static class DuplicateFindingExtensions
{
    internal static IEnumerable<IGrouping<TKey, T>> FindDuplicatesBy<T, TKey>(
        this IEnumerable<T> enumerable,
        Func<T, TKey> keySelector,
        IEqualityComparer<TKey>? comparer = null)
        => enumerable.GroupBy(keySelector, comparer).Where(g => g.Count() > 1);

    internal static IEnumerable<T> FindDuplicates<T>(this IEnumerable<T> enumerable, IEqualityComparer<T>? comparer = null)
        => enumerable.FindDuplicatesBy(i => i, comparer).Select(i => i.Key);

    internal static bool TryFindDuplicateBy<T, TKey>(
        this IEnumerable<T> items,
        Func<T, TKey> keySelector,
        out IGrouping<TKey, T>? duplicate,
        IEqualityComparer<TKey>? comparer = null)
        => (duplicate = Enumerable.FirstOrDefault(items.FindDuplicatesBy(keySelector, comparer))) != null;

    internal static IEnumerable<TItem> CheckNoDuplicatesBy<TItem, TKey>(
        this IEnumerable<TItem> items,
        Expression<Func<TItem, TKey>> keySelector,
        IEqualityComparer<TKey>? comparer = null)
    {
        items = items.Enumerate();

        if (items.TryFindDuplicateBy(keySelector.CompileCached(), out var duplicate, comparer))
            throw new DuplicateException(duplicate!.Key, $"Items of type {typeof(TItem)} must be unique according to expression {keySelector}"
                                                         + $" but value '{duplicate.Key}' is used by: {duplicate.Select(x => x.Dump()).Join(" vs. ")}.");

        return items;
    }
}
