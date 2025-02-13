#nullable enable

namespace Frontend.Vanilla.Content.FieldConversion;

/// <summary>
/// Converts the raw value of Sitecore field to strongly-typed CLR object.
/// </summary>
public interface IFieldConverter<TField>
{
    /// <summary>
    /// Converts the value of the given <see cref="IFieldConversionContext.FieldValue" /> field conversion context.
    /// It should throw an exception in case of an error e.g. invalid value. Calling code records all field details.
    /// </summary>
    TField Convert(IFieldConversionContext context);
}
