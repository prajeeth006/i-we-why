#nullable enable

namespace Frontend.Vanilla.Content.FieldConversion.Converters;

internal sealed class StringConverter : IFieldConverter<string?>
{
    public string? Convert(IFieldConversionContext context)
        => context.FieldValue;
}
