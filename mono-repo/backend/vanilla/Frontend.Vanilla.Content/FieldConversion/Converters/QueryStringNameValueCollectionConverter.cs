using System.Collections.Specialized;
using System.Web;
using Frontend.Vanilla.Core.Collections;

namespace Frontend.Vanilla.Content.FieldConversion.Converters;

/// <summary>
/// Represents a converter producing <see cref="System.Collections.Specialized.NameValueCollection"/> as a result of the conversion.
/// </summary>
internal sealed class QueryStringNameValueCollectionConverter : IFieldConverter<NameValueCollection>
{
    public NameValueCollection Convert(IFieldConversionContext context)
        => !string.IsNullOrWhiteSpace(context.FieldValue)
            ? HttpUtility.ParseQueryString(context.FieldValue).AsReadOnly()
            : ReadOnlyNameValueCollection.Empty;
}
