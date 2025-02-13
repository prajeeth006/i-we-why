using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Features.DomainSpecificActions.Configuration;

/// <summary>
/// Replaces configured placeholders in DSL action string.
/// </summary>
internal interface IDsaPlaceholderReplacer
{
    string Replace(string actionString, IReadOnlyDictionary<string, string?> placeholders);
}

internal sealed class DsaPlaceholderReplacer : IDsaPlaceholderReplacer
{
    public static readonly Regex PlaceholderRegex = new Regex(@"\$\{.*?\}", RegexOptions.Compiled);

    public string Replace(string actionString, IReadOnlyDictionary<string, string?> placeholders)
        => PlaceholderRegex.Replace(actionString,
            match => placeholders.TryGetValue(match.Value, out var replacement)
                ? replacement!
                : throw new Exception($"Found placeholder '{match.Value}' which isn't configured in Placeholders. Configured ones: {placeholders.Keys.Dump()}."));
}
