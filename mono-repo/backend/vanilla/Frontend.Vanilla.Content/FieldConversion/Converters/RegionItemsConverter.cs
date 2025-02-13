using System;
using System.Collections.Generic;
using Frontend.Vanilla.Core.Collections;

namespace Frontend.Vanilla.Content.FieldConversion.Converters;

/// <summary>
/// Represents a converter producing a <see cref="IEnumerable{T}"/> of <see cref="KeyValuePair{TKey,TValue}"/> as a result of the conversion
/// with TKey being a string and TValue being a <see cref="DocumentId"/>.
/// </summary>
internal class RegionItemsConverter(IBwinNameValueCollectionParser bwinCollectionParser) : IFieldConverter<IReadOnlyList<KeyValuePair<string, DocumentId>>>
{
    public IReadOnlyList<KeyValuePair<string, DocumentId>> Convert(IFieldConversionContext context)
    {
        var rawItems = bwinCollectionParser.Parse(context.FieldValue);

        if (rawItems.Count == 0)
            return Array.Empty<KeyValuePair<string, DocumentId>>();

        return rawItems
            .ConvertAll(item =>
            {
                if (string.IsNullOrWhiteSpace(item.Value))
                    throw new FormatException($"Entry with key '{item.Key}' is missing target document ID.");

                var documentId = context.CreateDocumentId(item.Value);

                return new KeyValuePair<string, DocumentId>(item.Key, documentId);
            })
            .AsReadOnly();
    }
}
