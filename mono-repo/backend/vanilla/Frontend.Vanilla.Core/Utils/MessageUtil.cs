using System;
using System.Collections;
using System.Linq;
using System.Security.Claims;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Microsoft.Extensions.Primitives;

namespace Frontend.Vanilla.Core.Utils;

/// <summary>
/// Utility for nice formatting of objects written to a diagnostic message e.g. exception, log.
/// </summary>
internal static class MessageUtil
{
    /// <summary>Formats the value according to its type to be used in a diagnostic message e.g. exception, log.</summary>
    public static string Dump<T>(this T value)
    {
        switch (value)
        {
            case null:
                return "null";
            case string _:
            case Uri _:
            case char _:
            case RequiredString _:
                return $"'{value}'";
            case StringValues sv:
                return sv.Count > 1 ? $"[{Dump((string[])sv!)}]" : Dump((string)sv!);
            case DateTime time:
                return $"{time:yyyy-MM-dd HH:mm:ss} {time.Kind}";
            case UtcDateTime utcTime:
                return Dump(utcTime.Value);
            case IEnumerable enumerable:
                return enumerable.Cast<object>().Select(Dump).Join().WhiteSpaceToNull() ?? "(empty)";
            case IConvertible convertible:
                return convertible.ToInvariantString();
            default:
                return value.ToString()!;
        }
    }

    public static string DumpType<T>(this T value)
        => value?.GetType().ToString() ?? "null";

    public static string? Truncate(string? str, int maxLength)
        => str?.Length > maxLength ? $"{str.Substring(0, maxLength)}... ({str.Length} chars total)" : str;

    public static string Format(ClaimsPrincipal user)
    {
        if (user == null)
            return "null user";
        if (user.Identity == null)
            return "user without Identity";
        if (!user.Identity.IsAuthenticated && !string.IsNullOrEmpty(user.Identity.Name))
            return $"anonymous user '{user.Identity.Name}' (most likely in the workflow)";
        if (!user.Identity.IsAuthenticated)
            return "anonymous user";

        return $"authenticated user '{user.Identity.Name}'";
    }
}
