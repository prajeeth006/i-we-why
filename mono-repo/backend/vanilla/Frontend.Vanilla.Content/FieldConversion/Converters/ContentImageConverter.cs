#nullable enable

using System.Xml.Linq;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Xml;

namespace Frontend.Vanilla.Content.FieldConversion.Converters;

/// <summary>
/// Represents a converter producing <see cref="ContentImage" /> as a result of the conversion.
/// </summary>
internal sealed class ContentImageConverter : IFieldConverter<ContentImage?>
{
    public ContentImage? Convert(IFieldConversionContext context)
    {
        if (string.IsNullOrWhiteSpace(context.FieldValue))
            return null;

        var xml = XElement.Parse(context.FieldValue);
        var src = xml.RequiredAttributeValue("src");
        var alt = (string?)xml.Attribute("alt");
        var width = ToInt32(xml.Attribute("width"));
        var height = ToInt32(xml.Attribute("height"));

        return new ContentImage(src, alt, width, height);
    }

    private static int? ToInt32(XAttribute? attr)
        => !string.IsNullOrEmpty(attr?.Value) ? (int?)attr : null;
}
