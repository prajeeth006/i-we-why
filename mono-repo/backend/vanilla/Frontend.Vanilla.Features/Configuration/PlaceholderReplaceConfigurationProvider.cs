using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using Frontend.Vanilla.Core.Collections;
using Microsoft.Extensions.Configuration;

namespace Frontend.Vanilla.Features.Configuration;

internal sealed partial class PlaceholderReplaceConfigurationProvider(IConfigurationRoot baseConfiguration, (string, string)[] placeholders) : ConfigurationProvider
{
    public override void Load()
    {
        // Get the original settings from appsettings.json
        var baseSettings = baseConfiguration.AsEnumerable().ToList();

        // Define a regex pattern for the placeholders
        var placeholderPattern = PlaceholderRegex();

        // Take only settings with values matching placeholder pattern
        foreach (var kvp in baseSettings.Where(s => !string.IsNullOrEmpty(s.Value) && placeholderPattern.IsMatch(s.Value)))
        {
            Data[kvp.Key] = placeholderPattern.Replace(kvp.Value!, match =>
            {
                var placeholderName = match.Groups[1].Value;
                return GetPlaceholderValue(placeholderName, match.Value);
            });
        }
    }

    /// <summary>Gets placeholder value using following priority:
    /// first searches in environment variables
    /// then in placeholders
    /// when no match is found, throws comprehensive exception.</summary>
    private string GetPlaceholderValue(string placeholderName, string fullPlaceholder)
    {
        var envVariableValue = Environment.GetEnvironmentVariable(placeholderName);
        if (envVariableValue is not null)
        {
            return envVariableValue;
        }

        var placeholderValue = placeholders.SingleOrDefault(p => p.Item1 == placeholderName);
        if (placeholderValue.Item1 is not null)
        {
            return placeholderValue.Item2;
        }

        throw new Exception($"Failed to replace appsettings.json placeholder '{fullPlaceholder}'. Neither environment variable nor placeholder with name '{placeholderName}' were found. Existing placeholders are '{placeholders.Select(p => p.Item1).Join()}'.");
    }

    [GeneratedRegex(@"\$\{(.*?)\}")]
    private static partial Regex PlaceholderRegex();
}
