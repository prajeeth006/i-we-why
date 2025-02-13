using System.Globalization;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.DomainSpecificLanguage.Parsing.Lexical;

internal static class DslNumber
{
    private const NumberStyles Style
        = NumberStyles.AllowLeadingSign
          | NumberStyles.AllowLeadingWhite
          | NumberStyles.AllowTrailingWhite
          | NumberStyles.AllowDecimalPoint;

    public static bool TryParse(string? str, out decimal value)
        => decimal.TryParse(str, Style, CultureInfo.InvariantCulture, out value);

    public static string ToString(decimal value)
        => value.ToInvariantString();
}
