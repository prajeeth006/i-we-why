using System.Collections;
using System.Collections.Generic;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Collections;

/// <summary>
/// Base class for implementation of <see cref="IDictionary{TKey,TValue}" /> because <see cref="Dictionary{TKey,TValue}" /> can't be overridden at all.
/// </summary>
public abstract class DictionaryBase<TKey, TValue> : IDictionary<TKey, TValue>, IReadOnlyDictionary<TKey, TValue>
    where TKey : notnull
{
    /// <summary>Gets inner decorated dictionary.</summary>
    private readonly IDictionary<TKey, TValue> inner;

    /// <summary>Creates a new instance.</summary>
    protected DictionaryBase(IEnumerable<KeyValuePair<TKey, TValue>>? itemsToCopy = null, IEqualityComparer<TKey>? keyComparer = null)
    {
        inner = new Dictionary<TKey, TValue>(keyComparer);
        itemsToCopy?.Each(Add);
    }

    /// <summary>Validates a key and a value specified by caller before it's being added, set or removed from/to inner dictionary.</summary>
    public virtual void ValidateItem(TKey key, TValue value)
    {
        ValidateKeyInternal(key);
        ValidateValue(value);
    }

    /// <summary>Validates a key specified by caller before it's being retrieved, added, set or  from/to inner dictionary.</summary>
    public virtual void ValidateKey(TKey key)
        => Guard.NotNull(key, nameof(key));

    /// <summary>Validates a value specified by caller before it's being added, set or removed from/to inner dictionary.</summary>
    public virtual void ValidateValue(TValue value) { }

    private void ValidateItemInternal(TKey key, TValue value)
    {
        Guard.NotNull(key, nameof(key));
        ValidateItem(key, value);
    }

    private void ValidateKeyInternal(TKey key)
    {
        Guard.NotNull(key, nameof(key));
        ValidateKey(key);
    }

#pragma warning disable CS1591 // Standard dictionary API -> no docs needed
    public virtual bool TryGetValue(TKey key, out TValue value)
    {
        ValidateKeyInternal(key);

        return inner.TryGetValue(key, out value!);
    }

    public virtual TValue this[TKey key]
    {
        get
        {
            ValidateKeyInternal(key);

            return inner[key];
        }
        set
        {
            ValidateItemInternal(key, value);
            inner[key] = value;
        }
    }

    public virtual void Add(TKey key, TValue value)
    {
        ValidateItemInternal(key, value);
        inner.Add(key, value);
    }

    public virtual bool Contains(KeyValuePair<TKey, TValue> item)
    {
        ValidateItemInternal(item.Key, item.Value);

        return inner.Contains(item);
    }

    public virtual bool ContainsKey(TKey key)
    {
        ValidateKeyInternal(key);

        return inner.ContainsKey(key);
    }

    public virtual bool Remove(KeyValuePair<TKey, TValue> item)
    {
        ValidateItemInternal(item.Key, item.Value);

        return inner.Remove(item);
    }

    public virtual bool Remove(TKey key)
    {
        ValidateKeyInternal(key);

        return inner.Remove(key);
    }

    public virtual int Count => inner.Count;
    public virtual bool IsReadOnly => inner.IsReadOnly;
    public virtual ICollection<TKey> Keys => inner.Keys;
    public virtual ICollection<TValue> Values => inner.Values;
    public virtual void Clear() => inner.Clear();
    public virtual void CopyTo(KeyValuePair<TKey, TValue>[] array, int arrayIndex) => inner.CopyTo(array, arrayIndex);
    public virtual IEnumerator<KeyValuePair<TKey, TValue>> GetEnumerator() => inner.GetEnumerator();

    // Non-virtual members in order to keep single override
    public void Add(KeyValuePair<TKey, TValue> item) => Add(item.Key, item.Value);
    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
    IEnumerable<TKey> IReadOnlyDictionary<TKey, TValue>.Keys => Keys;
    IEnumerable<TValue> IReadOnlyDictionary<TKey, TValue>.Values => Values;
#pragma warning restore CS1591
}
