using System;
using System.Collections.Generic;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Collections;

internal static class DictionaryStringExtensions
{
    /// <summary>Throws comprehensive exception if retrieved value is not a string nor null.</summary>
    public static bool TryGetString(this IDictionary<string, object?> dictionary, string key, string valueDescription, out string? value)
    {
        var isFound = dictionary.TryGetValue(key, out var rawValue);
        value = rawValue switch
        {
            null => null,
            string s => s,
            _ => throw new InvalidCastException($"Existing {valueDescription} with key '{key}' must be a string but it's {rawValue.Dump()} of {rawValue.DumpType()}."),
        };

        return isFound;
    }

    public static string? GetString(this IDictionary<string, object?> dictionary, string key, string valueDescription)
        => dictionary.TryGetString(key, valueDescription, out var value) ? value : null;

    public static string GetRequiredString(this IDictionary<string, object?> dictionary, string key, string valueDescription)
        => dictionary.GetString(key, valueDescription).WhiteSpaceToNull()
           ?? throw new KeyNotFoundException($"Missing mandatory {valueDescription} with key '{key}'. Existing ones: {dictionary.Keys.Dump()}.");
}
