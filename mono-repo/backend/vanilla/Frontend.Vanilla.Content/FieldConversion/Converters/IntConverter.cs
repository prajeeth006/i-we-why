namespace Frontend.Vanilla.Content.FieldConversion.Converters;

/// <summary>
/// Represents a converter producing <see langword="int"/> as a result of the conversion.
/// </summary>
internal sealed class IntConverter : IFieldConverter<int>
{
    public int Convert(IFieldConversionContext context)
        => !string.IsNullOrWhiteSpace(context.FieldValue)
            ? int.Parse(context.FieldValue)
            : 0;
}
