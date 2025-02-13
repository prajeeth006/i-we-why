using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Configuration.DynaCon.Reporting;

/// <summary>
/// Stores past items of particular type.
/// Their count is limited according to settings.
/// Collection is thread-safe for both reading and writing.
/// </summary>
internal interface IHistoryLog<T>
    where T : class, IHistoryItem
{
    IReadOnlyList<T> GetItems();
    void AddRange(IEnumerable<T> itemsToAdd);
}

internal interface IHistoryItem
{
    UtcDateTime Time { get; }
}

internal sealed class HistoryLog<T>(int maxCount) : IHistoryLog<T>
    where T : class, IHistoryItem
{
    private readonly int maxCount = Guard.GreaterOrEqual(maxCount, 0, nameof(maxCount));
    private volatile IReadOnlyList<T> items = Array.Empty<T>(); // Volatile for thread-safe reading
    private readonly Lock syncLock = new ();

    public IReadOnlyList<T> GetItems() => items;

    public void AddRange(IEnumerable<T> itemsToAdd)
    {
        if (maxCount == 0)
            return;

        var itemsToAddList = itemsToAdd.Enumerate();

        if (itemsToAddList.Count == 0)
            return;

        lock (syncLock) // Lock for thread-safe writing
            items = itemsToAddList // New items first b/c most likely newest -> avoids re-ordering
                .Concat(items)
                .OrderByDescending(c => c.Time)
                .Take(maxCount)
                .ToList()
                .AsReadOnly();
    }
}
