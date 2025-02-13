using System;
using System.Globalization;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.Content.FieldConversion.Converters;

/// <summary>
/// Represents a converter producing <see cref="DateTime"/> as a result of the conversion.
/// </summary>
internal sealed class DateTimeConverter : IFieldConverter<UtcDateTime>
{
    public const string Format = "yyyyMMdd'T'HHmmss";

    public UtcDateTime Convert(IFieldConversionContext context)
    {
        if (string.IsNullOrWhiteSpace(context.FieldValue))
            return default;

        const DateTimeStyles flags = DateTimeStyles.AllowWhiteSpaces
                                     | DateTimeStyles.AssumeUniversal
                                     | DateTimeStyles.AdjustToUniversal
                                     | DateTimeStyles.NoCurrentDateDefault;

        return DateTime.TryParseExact(context.FieldValue, Format, CultureInfo.InvariantCulture, flags, out var dateTime)
            ? new UtcDateTime(dateTime)
            : throw new Exception($"The field value isn't according to DateTime format '{Format}' as expected.");
    }
}
