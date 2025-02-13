using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using Frontend.Vanilla.Core.Ioc;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Collections;

/// <summary>
/// Provides extension methods for <see cref="IDictionary{TKey,TValue}" />.
/// </summary>
public static class DictionaryExtensions
{
    /// <summary>
    /// Returns the value stored in a dictionary under the specified <paramref name="key" />.
    /// If given collection is not a <see cref="IDictionary{TKey,TValue}" /> nor <see cref="IReadOnlyDictionary{TKey,TValue}" />,
    /// finds single item with specified <paramref name="key" />.
    /// If no item is present for the key, default value is returned.
    /// </summary>
    [return: MaybeNull]
    public static TValue GetValue<TKey, TValue>(this IEnumerable<KeyValuePair<TKey, TValue>> dictionary, TKey key)
        where TKey : notnull
    {
        switch (dictionary)
        {
            case IDictionary<TKey, TValue> iDict:
                return iDict.TryGetValue(key, out var result) ? result : default;
            case IReadOnlyDictionary<TKey, TValue> roDict:
                return roDict.TryGetValue(key, out result) ? result : default;
            default:
                return dictionary.SingleOrDefault(i => key.Equals(i.Key)).Value;
        }
    }

    /// <summary>Adds specified key-value tuples to this dictionary. Thanks to the name 'Add', works with collection initializer.</summary>
    internal static void Add<TKey, TValue>(this IDictionary<TKey, TValue> dictionary, params (TKey Key, TValue Value)[] itemsToAdd)
        where TKey : notnull
        => dictionary.Add(itemsToAdd, default);

    /// <summary>Adds specified key-value tuples to this dictionary. Thanks to the name 'Add', works with collection initializer.</summary>
    /// <exception cref="InvalidOperationException">If there is a conflict and <see cref="KeyConflictResolution.Throw" /> is specified.</exception>
    internal static void Add<TKey, TValue>(
        this IDictionary<TKey, TValue> dictionary,
        IEnumerable<(TKey Key, TValue Value)> itemsToAdd,
        KeyConflictResolution conflictResolution = default)
        where TKey : notnull
        => dictionary.Add(itemsToAdd.Select(i => KeyValue.Get(i.Key, i.Value)), conflictResolution);

    /// <summary>Adds specified key-value pairs to this dictionary. Thanks to the name 'Add', works with collection initializer.</summary>
    /// <exception cref="InvalidOperationException">If there is a conflict and <see cref="KeyConflictResolution.Throw" /> is specified.</exception>
    public static void Add<TKey, TValue>(
        this IDictionary<TKey, TValue> dictionary,
        IEnumerable<KeyValuePair<TKey, TValue>> itemsToAdd,
        KeyConflictResolution conflictResolution = default)
        where TKey : notnull
    {
        Guard.NotNull(dictionary, nameof(dictionary));
        Guard.NotNull(itemsToAdd, nameof(itemsToAdd));

        foreach (var pair in itemsToAdd)
            dictionary.Add(pair.Key, pair.Value, conflictResolution);
    }

    /// <summary>
    /// Adds specified name-value collection to this dictionary. Thanks to the name 'Add', works with collection initializer.
    /// </summary>
    /// <exception cref="InvalidOperationException">If there is a conflict and <see cref="KeyConflictResolution.Throw" /> is specified.</exception>
    public static void Add(this IDictionary<string, object?> dictionary, NameValueCollection itemsToAdd, KeyConflictResolution conflictResolution = default)
    {
        Guard.NotNull(dictionary, nameof(dictionary));
        Guard.NotNull(itemsToAdd, nameof(itemsToAdd));

        if (conflictResolution == KeyConflictResolution.Throw && itemsToAdd.AllKeys.Contains(null))
            throw new InvalidOperationException(
                $"NameValueCollection contains NULL key with value '{itemsToAdd[null]}' which can't be added to a dictionary contain in general");

        foreach (var key in itemsToAdd.AllKeys)
        {
            if (key == null)
                continue;

            var values = itemsToAdd.GetValuesForExistingKey(key);

            if (conflictResolution == KeyConflictResolution.Throw && values.Length > 1)
                throw new InvalidOperationException(
                    $"NameValueCollection contains multiple values for key '{key}' but dictionary can hold only single one: {values.Join()}");

            dictionary.Add(key, values[0], conflictResolution);
        }
    }

    private static void Add<TKey, TValue>(this IDictionary<TKey, TValue> dictionary, TKey key, TValue value, KeyConflictResolution conflictResolution)
        where TKey : notnull
    {
        switch (conflictResolution)
        {
            case KeyConflictResolution.Throw:
                try
                {
                    dictionary.Add(key, value);
                }
                catch (ArgumentException ex) when (!(ex is ArgumentNullException)) // Recreate exception b/c old .NET Framework doesn't include key in the message
                {
                    throw new DuplicateException(key, $"Target Dictionary<{typeof(TKey)}, {typeof(TValue)}> already contains an entry with key {key.Dump()}."
                                                      + $" Existing value: {dictionary[key].Dump()} vs. attempted: {value.Dump()}.");
                }

                break;

            case KeyConflictResolution.Skip:
                if (!dictionary.ContainsKey(key))
                    dictionary.Add(key, value);

                break;

            case KeyConflictResolution.Overwrite:
                dictionary[key] = value;

                break;

            default:
                throw conflictResolution.GetInvalidException();
        }
    }

    /// <summary>For multithread scenarios, using ConcurrentDictionary of HttpContext.Items from <see cref="ICurrentContextAccessor"/>.</summary>
    internal static TValue GetOrAddFromFactory<TKey, TValue>(this ConcurrentDictionary<object, Lazy<object?>> dictionary, TKey key, Func<TKey, TValue> factory)
       where TKey : notnull
       where TValue : notnull
       => dictionary.GetOrAddValuesInternal(key, factory, key, v => v);

    internal static TValue GetOrAddValuesInternal<TKey, TValue, TArgument, TCreated>(
        this ConcurrentDictionary<object, Lazy<object?>> dictionary,
        TKey key,
        Func<TArgument, TCreated> factory,
        TArgument arg,
        Func<TCreated, TValue> castFactoryResult)
        where TKey : notnull
    {
        var rawValue = dictionary.GetOrAdd(key, new Lazy<object?>(() => castFactoryResult(factory(arg)), true));

        return rawValue.Value is TValue value
       ? value
       : throw new Exception($"Unexpected {(rawValue?.GetType()).Dump()} value found instead of {typeof(TValue)} for key {key.Dump()}. Most likely someone overwrote it or broke nullable.");
    }

    /// <summary>
    /// Retrieves value from given collection by the key and tries to convert it using bool.TryParse.
    /// Returns false if value is not found or empty. Throws an exception if the value can't be parsed.
    /// </summary>
    public static bool GetBoolean(this IReadOnlyDictionary<string, string> dictionary, string key)
    {
        Guard.NotNull(dictionary, nameof(dictionary));

        var value = dictionary.GetValue(key);

        if (string.IsNullOrEmpty(value))
            return false;

        try
        {
            return bool.Parse(value);
        }
        catch (FormatException ex)
        {
            throw new InvalidOperationException($"Unable to parse boolean from value '{value}' stored by key '{key}'", ex);
        }
    }
}
