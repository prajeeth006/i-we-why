using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Configuration;

namespace Frontend.Vanilla.Features.WebIntegration.Configuration.DynaCon;

/// <summary>
/// Replaces DynaCon parameters usually in path of some configuration related file.
/// </summary>
internal interface IDynaConParameterReplacer
{
    string Replace(string pattern, IEnumerable<DynaConParameter> parameters);
}

internal sealed class DynaConParameterReplacer : IDynaConParameterReplacer
{
    private static IEnumerable<char> GetInvalidFileNameCharsForAllPlatforms() =>
    [
        '\"', '<', '>', '|', '\0',
        (char)1, (char)2, (char)3, (char)4, (char)5, (char)6, (char)7, (char)8, (char)9, (char)10,
        (char)11, (char)12, (char)13, (char)14, (char)15, (char)16, (char)17, (char)18, (char)19, (char)20,
        (char)21, (char)22, (char)23, (char)24, (char)25, (char)26, (char)27, (char)28, (char)29, (char)30,
        (char)31, ':', '*', '?', '\\', '/', '\u003A',
    ];

    public string Replace(string pattern, IEnumerable<DynaConParameter> parameters)
    {
        parameters = parameters.Enumerate();

        try
        {
            return Regex.Replace(pattern, @"\{[^\}]+\}", match =>
            {
                var name = match.Value.Substring(1, match.Value.Length - 2);
                var value = parameters
                    .Where(p => p.Name.Equals(name, StringComparison.OrdinalIgnoreCase))
                    .Select(p => p.Value)
                    .Join("&");

                if (string.IsNullOrEmpty(value))
                    throw new Exception($"Unable to find corresponding DynaCon parameter for placeholder '{match.Value}'.");

                foreach (var invalidChar in GetInvalidFileNameCharsForAllPlatforms())
                    value = value.Replace(invalidChar, '-');

                return value;
            });
        }
        catch (Exception ex)
        {
            throw new Exception($"Failed resolving file path from pattern '{pattern}'.", ex);
        }
    }
}
