using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using Frontend.Vanilla.Core.Validation.Annotations;
using JetBrains.Annotations;

namespace Frontend.Vanilla.Features.SuspiciousRequest;

internal interface ISuspiciousRequestConfiguration
{
    IDictionary<string, StringRule> QueryStringRules { get; }
    IDictionary<string, StringRule> CookieStringRules { get; }
}

internal class SuspiciousRequestConfiguration : ISuspiciousRequestConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.SuspiciousRequest";

    [Required, RequiredKeys, UniqueKeys(StringComparison.OrdinalIgnoreCase)]
    public IDictionary<string, StringRule> QueryStringRules { get; set; } = new Dictionary<string, StringRule>();

    [Required, RequiredKeys, UniqueKeys(StringComparison.OrdinalIgnoreCase)]
    public IDictionary<string, StringRule> CookieStringRules { get; set; } = new Dictionary<string, StringRule>();
}

internal class StringRule([RegexPattern] string regex, string description)
{
    public Regex Regex { get; } = ValidateRegex(regex, description);
    public string Description { get; } = description;

    private static Regex ValidateRegex(string regex, string description)
    {
        if (string.IsNullOrWhiteSpace(regex))
            throw new ArgumentException(
                $"Missing Regex in the rule QueryStringRule with description '{description}'.");

        try
        {
            return new Regex(regex, RegexOptions.Compiled | RegexOptions.IgnoreCase);
        }
        catch (Exception ex)
        {
            throw new ArgumentException(
                $"Regex '{regex}' isn't a valid regular expression: {ex.Message}");
        }
    }
}
