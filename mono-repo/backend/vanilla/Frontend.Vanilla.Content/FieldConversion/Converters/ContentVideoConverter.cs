#nullable enable

using System.Xml.Linq;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Xml;

namespace Frontend.Vanilla.Content.FieldConversion.Converters;

/// <summary>
/// Represents a converter producing <see cref="ContentVideo" /> as a result of the conversion.
/// </summary>
internal sealed class ContentVideoConverter : IFieldConverter<ContentVideo?>
{
    public ContentVideo? Convert(IFieldConversionContext context)
    {
        if (string.IsNullOrWhiteSpace(context.FieldValue))
        {
            return null;
        }

        var xml = XElement.Parse(context.FieldValue);
        var uid = xml.RequiredAttributeValue("data-uid");
        var src = xml.RequiredAttributeValue("src");
        var width = xml.Attribute("width")?.Value.ToInt32();
        var height = xml.Attribute("height")?.Value.ToInt32();

        return new ContentVideo(uid, src, width, height);
    }
}
