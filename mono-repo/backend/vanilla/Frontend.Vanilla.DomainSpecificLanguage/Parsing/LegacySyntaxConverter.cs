using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.DomainSpecificLanguage.Parsing;

/// <summary>
/// Converts some legacy unsupported C# syntax to valdi syntax so that consumers can easily transition from old DSL compiler.
/// </summary>
internal interface ILegacySyntaxConverter
{
    WithWarnings<RequiredString> Convert(RequiredString expresion);
}

internal sealed class LegacySyntaxConverter : ILegacySyntaxConverter
{
    private static readonly IReadOnlyDictionary<string, string> Replacements = new Dictionary<string, string>
    {
        { ".StartsWith", " STARTS-WITH " },
        { ".EndsWith", " ENDS-WITH " },
        { ".Contains", " CONTAINS " },
        { "()", "" },
    };

    public WithWarnings<RequiredString> Convert(RequiredString expresion)
    {
        var warnings = new List<TrimmedRequiredString>();
        var builder = new StringBuilder(expresion);

        foreach (var replacement in Replacements)
        {
            var i = LocateLegacySubstrFrom(0);

            if (i < 0)
                continue;

            warnings.Add(
                $"Detected legacy '{replacement.Key}' expression which will not be supported soon. Replace it with newer '{replacement.Value.Trim()}' operator as soon as possible.");

            while (i >= 0)
            {
                builder.Remove(i, replacement.Key.Length).Insert(i, replacement.Value);
                i = LocateLegacySubstrFrom(i + replacement.Value.Length);
            }

            int LocateLegacySubstrFrom(int startIndex)
            {
                var j = builder.IndexOf(replacement.Key, startIndex);

                // In addition it must match full provider access pattern
                return j >= 0 && Regex.IsMatch(builder.ToString(startIndex, j - startIndex), @"\w+\.\w+$") ? j : -1;
            }
        }

        var resultExpression = new RequiredString(builder.ToString());

        return resultExpression.WithWarnings(warnings);
    }
}
