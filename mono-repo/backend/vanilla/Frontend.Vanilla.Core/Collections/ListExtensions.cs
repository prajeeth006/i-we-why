using System;
using System.Collections.Generic;

namespace Frontend.Vanilla.Core.Collections;

/// <summary>
/// Extension methods for <see cref="IList{T}" />.
/// </summary>
internal static class ListExtensions
{
    internal static TResult[] ConvertAll<TSource, TResult>(this IReadOnlyCollection<TSource> source, Func<TSource, int, TResult> selector)
    {
        var index = 0;

        return source.ConvertAll(item => selector(item, index++));
    }

    internal static TResult[] ConvertAll<TSource, TResult>(this IReadOnlyCollection<TSource> source, Func<TSource, TResult> selector)
    {
        if (source.Count == 0) // Quick win
            return Array.Empty<TResult>();

        var destination = new TResult[source.Count];
        var index = 0;

        foreach (var item in source)
            destination[index++] = selector(item);

        return destination;
    }

    internal static ReadOnlySet<T> AsReadOnly<T>(this ISet<T> set)
        => set as ReadOnlySet<T> ?? new ReadOnlySet<T>(set);
}
