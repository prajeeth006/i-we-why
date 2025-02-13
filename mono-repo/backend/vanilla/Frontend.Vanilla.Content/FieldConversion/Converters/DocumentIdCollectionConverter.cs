using System;
using System.Collections.Generic;
using System.Linq;

namespace Frontend.Vanilla.Content.FieldConversion.Converters;

/// <summary>
/// Represents a converter producing a list of <see cref="DocumentId"/> as a result of
/// the conversion from a content field of type <c>Treelist</c>.
/// </summary>
internal sealed class DocumentIdCollectionConverter : IFieldConverter<IReadOnlyList<DocumentId>>
{
    public IReadOnlyList<DocumentId> Convert(IFieldConversionContext context)
    {
        if (string.IsNullOrWhiteSpace(context.FieldValue))
            return Array.Empty<DocumentId>();

        return context.FieldValue
            .Split('|')
            .Where(id => !string.IsNullOrWhiteSpace(id))
            .Select(x =>
            {
                var document = context.CreateDocumentId(x);

                if (context.SourcePath == document.Path)
                    throw new Exception($"RelativeTreeList contains self referencing item: {document.Path}. Fix the selected item reference to remove this exception.");

                return document;
            })
            .ToList().AsReadOnly();
    }
}
