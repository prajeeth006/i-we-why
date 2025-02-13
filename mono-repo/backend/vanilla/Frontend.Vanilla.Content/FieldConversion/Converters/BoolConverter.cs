using System;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Content.FieldConversion.Converters;

/// <summary>
/// Represents a converter producing <see langword="bool"/> as a result of the conversion.
/// </summary>
internal sealed class BoolConverter : IFieldConverter<bool>
{
    public bool Convert(IFieldConversionContext context)
    {
        switch (context.FieldValue.WhiteSpaceToNull())
        {
            case "1":
                return true;

            case "0":
            case null:
                return false;

            default:
                throw new FormatException("The field value isn't supported.");
        }
    }
}
