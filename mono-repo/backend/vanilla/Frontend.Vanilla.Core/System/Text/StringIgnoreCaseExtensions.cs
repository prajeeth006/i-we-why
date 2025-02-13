using System;

namespace Frontend.Vanilla.Core.System.Text;

/// <summary>
/// Ordinal case-insensitive shortcuts b/c used very often.
/// </summary>
internal static class StringIgnoreCaseExtensions
{
    private static readonly StringComparison Comparison = StringComparison.OrdinalIgnoreCase;

    internal static bool EqualsIgnoreCase(this string str, string? other)
        => str.Equals(other, Comparison);

    internal static bool ContainsIgnoreCase(this string str, string substr)
        => str.Contains(substr, Comparison);

    internal static bool StartsWithIgnoreCase(this string str, string startSubstr)
        => str.StartsWith(startSubstr, Comparison);

    internal static bool EndsWithIgnoreCase(this string str, string endSubstr)
        => str.EndsWith(endSubstr, Comparison);
}
