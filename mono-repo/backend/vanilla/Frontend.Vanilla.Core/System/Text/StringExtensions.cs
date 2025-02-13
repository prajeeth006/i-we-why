using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Utils;
using Microsoft.Extensions.Primitives;

namespace Frontend.Vanilla.Core.System.Text;

/// <summary>
/// Extension methods for <see cref="string" />.
/// </summary>
public static class StringExtensions
{
    internal static bool IsNullOrEmpty([NotNullWhen(false)] this string? str)
        => string.IsNullOrEmpty(str);

    internal static bool IsNullOrWhiteSpace([NotNullWhen(false)] this string? str)
        => string.IsNullOrWhiteSpace(str);

    /// <summary>Removes the specified <paramref name="prefix" /> from this string if exists.</summary>
    public static string RemovePrefix(this string value, string? prefix, StringComparison comparison = StringComparison.Ordinal)
    {
        Guard.NotNull(value, nameof(value));

        return value.Length > 0 && prefix?.Length > 0 && value.StartsWith(prefix, comparison)
            ? value.Substring(prefix.Length)
            : value;
    }

    /// <summary>Removes the specified <paramref name="suffix" /> from this string if exists.</summary>
    public static string RemoveSuffix(this string value, string? suffix, StringComparison comparison = StringComparison.Ordinal)
    {
        Guard.NotNull(value, nameof(value));

        return value.Length > 0 && suffix?.Length > 0 && value.EndsWith(suffix, comparison)
            ? value.Substring(0, value.Length - suffix.Length)
            : value;
    }

    /// <summary>Removes all occurrences of all <paramref name="substr" /> within this string.</summary>
    public static string RemoveAll(this string value, string? substr, StringComparison comparison = StringComparison.Ordinal)
    {
        Guard.NotNull(value, nameof(value));

        if (!(value.Length > 0) || !(substr?.Length > 0))
            return value;

        int index;
        while ((index = value.IndexOf(substr, comparison)) >= 0)
            value = value.Remove(index, substr.Length);

        return value;
    }

    /// <summary>Converts this string to camel cased one. Implementation corresponds to the one from Newtonsoft.JSON.</summary>
    public static string ToCamelCase(this string value)
    {
        Guard.NotNull(value, nameof(value));

        if (string.IsNullOrWhiteSpace(value) || char.IsLower(value[0]))
            return value;

        var chars = value.ToCharArray();

        for (var i = 0; i < chars.Length; i++)
        {
            var hasNext = i + 1 < chars.Length;

            if (i > 0 && hasNext && char.IsLower(chars[i + 1]))
                break;

            chars[i] = char.ToLowerInvariant(chars[i]);
        }

        return new string(chars);
    }

    internal static string Capitalize(this string str)
    {
        Guard.NotNull(str, nameof(str));

        if (str.Length == 0 || !char.IsLower(str[0]))
            return str;

        var chars = str.ToCharArray();
        chars[0] = char.ToUpper(chars[0]);

        return new string(chars);
    }

    /// <summary>Converts null or whitespace value to null. Otherwise returns original value.</summary>
    public static string? WhiteSpaceToNull(this string? value)
        => string.IsNullOrWhiteSpace(value) ? null : value;

    /// <summary>Encodes all the characters in this string into a sequence of bytes using provided <paramref name="encoding" /> or UTF-8.</summary>
    public static byte[] EncodeToBytes(this string value, Encoding? encoding = null)
        => (encoding ?? Encoding.UTF8).GetBytes(value);

    /// <summary>Decodes this byte array into a string using provided <paramref name="encoding" /> or UTF-8.</summary>
    public static string DecodeToString(this byte[] bytes, Encoding? encoding = null)
    {
        if (bytes.Length == 0)
            return "";

        encoding ??= Encoding.UTF8;
        var preamble = encoding.GetPreamble();
        var startIndex = bytes.Take(preamble.Length).SequenceEqual(preamble) ? preamble.Length : 0;

        return encoding.GetString(bytes, startIndex, bytes.Length - startIndex);
    }

    /// <summary>Similar to <see cref="string.Contains(string)" /> but with comparison parameter.</summary>
    public static bool Contains(this string value, string substr, StringComparison comparison)
        => value.IndexOf(substr, comparison) >= 0;

    /// <summary>Converts <see cref="StringComparison" /> to <see cref="StringComparer" />.</summary>
    internal static StringComparer ToComparer(this StringComparison comparison)
        => comparison switch
        {
            StringComparison.CurrentCulture => StringComparer.CurrentCulture,
            StringComparison.CurrentCultureIgnoreCase => StringComparer.CurrentCultureIgnoreCase,
            StringComparison.InvariantCulture => StringComparer.InvariantCulture,
            StringComparison.InvariantCultureIgnoreCase => StringComparer.InvariantCultureIgnoreCase,
            StringComparison.Ordinal => StringComparer.Ordinal,
            StringComparison.OrdinalIgnoreCase => StringComparer.OrdinalIgnoreCase,
            _ => throw comparison.GetInvalidException(),
        };

    /// <summary>Creates a substring from all subsequent chars from start index that satisfy given condition.</summary>
    internal static string SubstringWhile(this string str, int startIndex, Func<char, bool> condition)
    {
        if (startIndex < 0 || startIndex > str.Length)
            throw new ArgumentOutOfRangeException(nameof(startIndex),
                $"StartIndex must be within given string '{str}' hence between 0 and {str.Length} (both inclusive) but it is {startIndex}.");

        var end = startIndex;
        while (end < str.Length && condition(str[end]))
            end++;

        return str.Substring(startIndex, end - startIndex);
    }

    internal static string SubstringMax(this string str, int startIndex, int maxLength)
        => str.Substring(startIndex, Math.Min(maxLength, str.Length - startIndex));

    internal static char LastChar(this string str)
        => str[str.Length - 1];

    internal static string?[] ToNonEmptyArray(this StringValues strs)
        => strs.Count > 0 ? strs.ToArray() : new string?[] { null };

    internal static IEnumerable<(string Key, string? Value)> EnumerateKeyValues(this IEnumerable<KeyValuePair<string, StringValues>> dictionary)
        => dictionary.SelectMany(i => i.Value.ToNonEmptyArray().Select(v => (i.Key, v)));

    /// <summary>Creates a new <see cref="TrimmedRequiredString" /> so the input string must be valid accordingly.</summary>
    internal static TrimmedRequiredString AsTrimmedRequired(this string str)
        => new TrimmedRequiredString(str);

    /// <summary>Creates a new <see cref="TrimmedRequiredString" /> so the input string must be valid accordingly.</summary>
    internal static RequiredString AsRequired(this string str)
        => new RequiredString(str);

    /// <summary> Replaces in string based on regex pattern. </summary>
    public static string PatternReplace(this string input, string pattern, string replacement) => Regex.Replace(input, pattern, replacement, RegexOptions.IgnoreCase);

    /// <summary> Returns truncated string.</summary>
    public static string Truncate(this string value, int maxLength)
    {
        if (string.IsNullOrEmpty(value))
        {
            return value;
        }

        return value.Length <= maxLength ? value : value.Substring(0, maxLength);
    }

    private const char QuerySeparator = '?';

    /// <summary> Returns separated strings for path and query. </summary>
    public static (string Path, string Query) SplitPath(this string url, bool removeSeparator = false)
    {
        var path = url;
        var query = string.Empty;
        var queryStart = url.IndexOf(QuerySeparator);

        if (queryStart >= 0)
        {
            path = url.Substring(0, queryStart);

            if (removeSeparator)
            {
                queryStart++;
            }

            query = url.Substring(queryStart);
        }

        return (path, query);
    }
}
