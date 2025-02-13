using System;
using System.Collections;
using System.Collections.Generic;

namespace Frontend.Vanilla.Core.Collections;

/// <summary>
/// Read-only wrapper for a <see cref="ISet{T}" />.
/// </summary>
internal sealed class ReadOnlySet<T>(ISet<T> inner) : ISet<T>, IReadOnlyCollection<T>
{
    public int Count => inner.Count;
    bool ICollection<T>.IsReadOnly => true;
    public bool Contains(T item) => inner.Contains(item);
    public void CopyTo(T[] array, int arrayIndex) => inner.CopyTo(array, arrayIndex);
    public IEnumerator<T> GetEnumerator() => inner.GetEnumerator();
    IEnumerator IEnumerable.GetEnumerator() => inner.GetEnumerator();
    public bool IsProperSubsetOf(IEnumerable<T> other) => inner.IsProperSubsetOf(other);
    public bool IsProperSupersetOf(IEnumerable<T> other) => inner.IsProperSupersetOf(other);
    public bool IsSubsetOf(IEnumerable<T> other) => inner.IsSubsetOf(other);
    public bool IsSupersetOf(IEnumerable<T> other) => inner.IsSupersetOf(other);
    public bool Overlaps(IEnumerable<T> other) => inner.Overlaps(other);
    public bool SetEquals(IEnumerable<T> other) => inner.SetEquals(other);

    // Modification methods -> throw and explicitly implemented in order to hide them from auto-complete
    private static Exception GetError() => new NotSupportedException("The collection is read-only.");

    bool ISet<T>.Add(T item) => throw GetError();
    void ICollection<T>.Add(T item) => throw GetError();
    void ICollection<T>.Clear() => throw GetError();
    void ISet<T>.ExceptWith(IEnumerable<T> other) => throw GetError();
    void ISet<T>.IntersectWith(IEnumerable<T> other) => throw GetError();
    bool ICollection<T>.Remove(T item) => throw GetError();
    void ISet<T>.SymmetricExceptWith(IEnumerable<T> other) => throw GetError();
    void ISet<T>.UnionWith(IEnumerable<T> other) => throw GetError();
}
