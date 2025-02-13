using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading;

namespace Frontend.Vanilla.Core.Collections;

/// <summary>
/// Thread-safe collection which stores predefined number of lastly added items.
/// </summary>
internal sealed class TemporaryBuffer<T>(int size) : IEnumerable<T>
    where T : class
{
    private readonly Lock itemsLock = new ();
    private readonly T?[] items = new T?[size];
    private int oldestIndex;

    public void Add(T item)
    {
        lock (itemsLock)
        {
            items[oldestIndex] = item;
            oldestIndex = (oldestIndex + 1) % items.Length;
        }
    }

    public IEnumerator<T> GetEnumerator()
    {
        T?[] itemsCopy;
        int oldestIndexCopy;

        lock (itemsLock)
        {
            itemsCopy = items.ToArray();
            oldestIndexCopy = oldestIndex;
        }

        return itemsCopy
            .Skip(oldestIndexCopy) // Older entries first
            .Concat(itemsCopy.Take(oldestIndexCopy)) // Then newer entries
            .WhereNotNull() // After app start there may be nulls
            .GetEnumerator();
    }

    IEnumerator IEnumerable.GetEnumerator()
        => GetEnumerator();
}
