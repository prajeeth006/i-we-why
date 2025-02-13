using System.Collections.Generic;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Collections;

/// <summary>
/// Extension methods for <see cref="ICollection{T}" />.
/// </summary>
public static class CollectionExtensions
{
    /// <summary>Adds specified elements to the end of this collection. Thanks to the name 'Add', works with collection initializer.</summary>
    public static void Add<T>(this ICollection<T> collection, IEnumerable<T> itemsToAdd)
    {
        Guard.NotNull(collection, nameof(collection));
        Guard.NotNull(itemsToAdd, nameof(itemsToAdd));

        if (collection is List<T> list) // Performance optimization
            list.AddRange(itemsToAdd);
        else
            foreach (var item in itemsToAdd)
                collection.Add(item);
    }

    /// <summary>Adds specified elements to the end of this collection. Thanks to the name 'Add', works with collection initializer.</summary>
    public static void Add<T>(this ICollection<T> collection, params T[] itemsToAdd)
        => collection.Add((IEnumerable<T>)itemsToAdd);
}
