using System;
using System.Collections.Specialized;
using System.Linq;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Collections;

/// <summary>
/// Provides extension methods for <see cref="NameValueCollection" />.
/// </summary>
public static class NameValueCollectionExtensions
{
    /// <summary>Returns a read-only wrapper around the given <see cref="NameValueCollection" />.</summary>
    public static NameValueCollection AsReadOnly(this NameValueCollection collection)
    {
        Guard.NotNull(collection, nameof(collection));

        return collection is ReadOnlyNameValueCollection ? collection : new ReadOnlyNameValueCollection(collection);
    }

    /// <summary>Determines whether the <see cref="NameValueCollection" /> contains the specified key according to given comparison.</summary>
    public static bool ContainsKey(this NameValueCollection collection, string key, StringComparison keyComparison = StringComparison.InvariantCultureIgnoreCase)
    {
        Guard.NotNull(collection, nameof(collection));

        return collection.AllKeys.Any(k => string.Equals(k, key, keyComparison));
    }

    /// <summary>
    /// Adds entries from <paramref name="entriesToAdd" /> collection to <paramref name="collection" />.
    /// On contrary to <see cref="NameValueCollection.Add(NameValueCollection)" /> conflicting values are not merged but resolved according to <paramref name="conflictResolution" />.
    /// </summary>
    public static void Add(
        this NameValueCollection collection,
        NameValueCollection entriesToAdd,
        KeyConflictResolution conflictResolution,
        StringComparison keyComparison = StringComparison.InvariantCultureIgnoreCase)
    {
        Guard.NotNull(collection, nameof(collection));
        Guard.NotNull(entriesToAdd, nameof(entriesToAdd));

        foreach (var key in entriesToAdd.AllKeys)
        {
            switch (conflictResolution)
            {
                case KeyConflictResolution.Skip:
                    if (collection.ContainsKey(key!, keyComparison))
                        continue;

                    break;
                case KeyConflictResolution.Overwrite:
                    collection.Remove(key);

                    break;
                case KeyConflictResolution.Throw:
                    if (collection.ContainsKey(key!, keyComparison))
                        throw new InvalidOperationException(
                            $"Target collection already contains an entry with key '{key}'. Existing value: '{collection[key]}' vs. attempted: '{entriesToAdd[key]}'");

                    break;
                default:
                    throw conflictResolution.GetInvalidException();
            }

            foreach (var value in entriesToAdd.GetValuesForExistingKey(key!))
                collection.Add(key, value);
        }
    }

    /// <summary>
    /// Retrieves value from given collection by the key and tries to convert it using bool.TryParse.
    /// Returns false if value is not found or empty. Throws an exception if the value can't be parsed.
    /// </summary>
    public static bool GetBoolean(this NameValueCollection collection, string key)
    {
        Guard.NotNull(collection, nameof(collection));

        var value = collection[key];

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

    internal static string?[] GetValuesForExistingKey(this NameValueCollection collection, string key)
        => collection.GetValues(key) ?? new string?[] { null }; // If value is null, GetValues() returns null just like if it was not found
}
