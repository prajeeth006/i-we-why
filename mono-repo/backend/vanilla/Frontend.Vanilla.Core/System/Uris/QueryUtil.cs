using System;
using System.Collections.Generic;
using System.Text;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Microsoft.Extensions.Primitives;

namespace Frontend.Vanilla.Core.System.Uris;

/// <summary>
/// Utility for working with query string. Independent from full .NET framework or external NuGet package.
/// Inspired by Microsoft.AspNetCore.WebUtilities.QueryHelpers.
/// </summary>
internal static class QueryUtil
{
    public static Dictionary<string, StringValues> Parse(string? query)
    {
        var result = new Dictionary<string, StringValues>(StringComparer.OrdinalIgnoreCase);

        if (query.IsNullOrEmpty() || query == "?")
            return result;

        var scanIndex = query[0] == '?' ? 1 : 0;
        var equalIndex = query.IndexOfOrEnd('=');

        while (scanIndex < query.Length)
        {
            var delimiterIndex = query.IndexOfOrEnd('&', startIndex: scanIndex);

            if (equalIndex < delimiterIndex)
            {
                while (scanIndex != equalIndex && char.IsWhiteSpace(query[scanIndex]))
                    ++scanIndex;

                var name = query.Substring(scanIndex, equalIndex - scanIndex);
                var value = query.Substring(equalIndex + 1, delimiterIndex - equalIndex - 1);
                result.Append(Unescape(name), Unescape(value));

                equalIndex = query.IndexOfOrEnd('=', startIndex: delimiterIndex);
            }
            else
            {
                if (delimiterIndex > scanIndex)
                    result.Append(query.Substring(scanIndex, delimiterIndex - scanIndex), "");
            }

            scanIndex = delimiterIndex + 1;
        }

        return result;
    }

    public static string Build(IEnumerable<KeyValuePair<string, StringValues>> query, bool escape = true)
    {
        var result = new StringBuilder();
        foreach (var param in query)
        foreach (var value in param.Value.ToNonEmptyArray())
            result.Append(result.Length > 0 ? "&" : "")
                .Append(escape ? Escape(param.Key) : param.Key)
                .Append('=')
                .Append(escape && value != null ? Escape(value) : value);

        return result.ToString();
    }

    public static void Append(this Dictionary<string, StringValues> query, string name, string? value)
    {
        Guard.NotNull(query, nameof(query));

        query.TryGetValue(name, out var existing);
        query[name] = StringValues.Concat(in existing, value);
    }

    private static int IndexOfOrEnd(this string str, char value, int startIndex = 0)
    {
        var index = str.IndexOf(value, startIndex);

        return index >= 0 ? index : str.Length;
    }

    private static string Escape(string str) => Uri.EscapeDataString(str);
    private static string Unescape(string str) => Uri.UnescapeDataString(str.Replace('+', ' '));
}
