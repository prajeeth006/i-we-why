using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Features.DomainSpecificActions.Configuration;

/// <summary>
/// Selects only request region from DSL action string and removes other regions.
/// </summary>
internal interface IDsaRegionSelector
{
    string SelectRegion(string actionString, TrimmedRequiredString regionName, IReadOnlyList<TrimmedRequiredString> supportedRegionNames);
}

internal sealed class DsaRegionSelector : IDsaRegionSelector
{
    private const string Prefix = "#EXECUTE";
    private const string Suffix = "#END-EXECUTE";

    public static readonly Regex RegionRegex = new Regex(
        $@"(^|\s+){Prefix}\s+(?<name>[\w-]+)\s+(?<body>.*?)\s+{Suffix}(\s+|$)",
        RegexOptions.Compiled | RegexOptions.Singleline);

    public string SelectRegion(string actionString, TrimmedRequiredString regionName, IReadOnlyList<TrimmedRequiredString> supportedRegionNames)
    {
        var newLine = Environment.NewLine;
        actionString = RegionRegex.Replace(actionString, match =>
        {
            var name = match.Groups["name"].Value;

            if (name == regionName)
                return newLine + match.Groups["body"].Value + newLine; // Trim region directives

            if (!supportedRegionNames.Any(n => n == name))
                throw new Exception($"Unknown region name '{name}'. Supported ones: {supportedRegionNames.Dump()}.");

            return newLine; // Remove undesired regions
        });

        VerifyDirective(actionString, Prefix);
        VerifyDirective(actionString, Suffix);

        return actionString.Trim();
    }

    private static void VerifyDirective(string actionString, string search)
    {
        var index = actionString.IndexOf(search, StringComparison.OrdinalIgnoreCase);

        if (index >= 0)
            throw new Exception(
                $"DSL action contains invalid directive '{actionString.Substring(index, search.Length)}'. Correct syntax: {Prefix} REGION-NAME dsl-statements {Suffix}");
    }
}
