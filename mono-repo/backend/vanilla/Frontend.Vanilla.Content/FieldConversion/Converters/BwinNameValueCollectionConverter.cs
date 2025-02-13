using System.Collections.Generic;
using System.Collections.Specialized;
using Frontend.Vanilla.Content.Model;

namespace Frontend.Vanilla.Content.FieldConversion.Converters;

/// <summary>
/// Represents a base class converter producing <see cref="NameValueCollection"/> as a result of the conversion.
/// </summary>
internal class BwinNameValueCollectionConverter(IBwinNameValueCollectionParser bwinCollectionParser) : IFieldConverter<ContentParameters>
{
    public ContentParameters Convert(IFieldConversionContext context)
    {
        var rawItems = bwinCollectionParser.Parse(context.FieldValue);

        if (rawItems.Count == 0)
            return ContentParameters.Empty;

        var result = new Dictionary<string, string>();
        foreach (var (key, value) in rawItems)
            result.Add(key, value);

        return result.AsContentParameters();
    }
}
