using System;
using System.Collections.Generic;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Collections;

namespace Frontend.Vanilla.Content.FieldConversion.Converters;

/// <summary>
/// Represents a converter producing a collection of <see cref="ListItem"/> as a result of the conversion.
/// </summary>
internal sealed class ListItemConverter(IBwinNameValueCollectionParser bwinCollectionParser) : IFieldConverter<IReadOnlyList<ListItem>>
{
    public IReadOnlyList<ListItem> Convert(IFieldConversionContext context)
    {
        var rawItems = bwinCollectionParser.Parse(context.FieldValue);

        return rawItems.Count > 0
            ? rawItems.ConvertAll(i => new ListItem(i.Key, i.Value)).AsReadOnly()
            : Array.Empty<ListItem>();
    }
}
