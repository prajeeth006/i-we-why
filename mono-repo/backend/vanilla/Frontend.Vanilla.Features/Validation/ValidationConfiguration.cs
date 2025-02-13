using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace Frontend.Vanilla.Features.Validation;

internal interface IValidationConfiguration
{
    Dictionary<string, string> RegexList { get; }
    Dictionary<string, ValidationRuleSet> Rules { get; }
    IDictionary<string, string> ErrorMapping { get; }
}

internal sealed class ValidationConfiguration : IValidationConfiguration
{
    public const string FeatureName = "LabelHost.Validation";

    public ValidationConfiguration(Dictionary<string, string> regexList,
        Dictionary<string, ValidationRuleSet> rules,
        IDictionary<string, string> errorMapping)
    {
        RegexList = regexList;
        Rules = rules;
        ErrorMapping = errorMapping;
        ReplacePlaceholders();
    }

    public Dictionary<string, string> RegexList { get; }
    public Dictionary<string, ValidationRuleSet> Rules { get; }
    public IDictionary<string, string> ErrorMapping { get; }

    private void ReplacePlaceholders()
    {
        foreach (var rule in Rules)
        {
            var validationRuleSet = rule.Value;

            if (!string.IsNullOrEmpty(validationRuleSet?.Regex))
            {
#nullable disable
                var matches = Regex.Matches(validationRuleSet.Regex, @"#(\w+)#");
#nullable enable
                var replaced = new HashSet<string>();

                foreach (Match match in matches)
                {
                    var regexKey = match.Groups[1].Value;

                    if (!replaced.Contains(regexKey) && RegexList.ContainsKey(regexKey))
                    {
                        validationRuleSet.Regex = validationRuleSet.Regex.Replace(match.Value, RegexList[regexKey]);
                        replaced.Add(regexKey);
                    }
                }
            }
        }
    }
}

internal sealed class ValidationRuleSet(
    string required,
    string minLength,
    string minLengthErrorMapping,
    string maxLength,
    string maxLengthErrorMapping,
    string min,
    string max,
    string regex,
    string regexErrorMapping)
{
    public string Required { get; set; } = required;

    public string MinLength { get; set; } = minLength;

    public string MinLengthErrorMapping { get; set; } = minLengthErrorMapping;

    public string MaxLength { get; set; } = maxLength;

    public string MaxLengthErrorMapping { get; set; } = maxLengthErrorMapping;

    public string Min { get; set; } = min;

    public string Max { get; set; } = max;

    public string Regex { get; set; } = regex;

    public string RegexErrorMapping { get; set; } = regexErrorMapping;
}
