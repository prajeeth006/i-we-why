#nullable enable

namespace Frontend.Vanilla.Content.FieldConversion.Converters;

/// <summary>
/// Represents a converter producing <see cref="DocumentId" /> as a result of the conversion.
/// </summary>
internal sealed class DocumentIdConverter : IFieldConverter<DocumentId?>
{
    public DocumentId? Convert(IFieldConversionContext context)
        => !string.IsNullOrWhiteSpace(context.FieldValue)
            ? context.CreateDocumentId(context.FieldValue)
            : null;
}
