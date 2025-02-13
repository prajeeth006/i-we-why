#nullable enable

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Xml;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Content.FieldConversion.Converters;

internal sealed class ContentLinkConverter : IFieldConverter<ContentLink?>
{
    private static readonly ReadOnlySet<string> SupportedAttributes = new[] { "title", "class", "target", "rel" }.ToHashSet().AsReadOnly();

    private static readonly XmlReaderSettings XmlSettings = new XmlReaderSettings
    {
        IgnoreComments = true,
        IgnoreProcessingInstructions = true,
        IgnoreWhitespace = true,
    };

    public ContentLink? Convert(IFieldConversionContext context)
    {
        if (string.IsNullOrWhiteSpace(context.FieldValue))
            return null;

        using (var stringReader = new StringReader(context.FieldValue ?? ""))
        {
            using (var reader = XmlReader.Create(stringReader, XmlSettings))
            {
                reader.Read();

                if (reader.LocalName != "a")
                    throw new Exception($"Link must use <a> tag but it is <{reader.Name}>.");

                var href = reader.GetAttribute("href");

                if (string.IsNullOrWhiteSpace(href) || !Uri.TryCreate(href, UriKind.RelativeOrAbsolute, out var url))
                    throw new Exception($"Invalid absolute or relative URL in href attribute which is {href.Dump()}.");

                var attrs = new Dictionary<string, string?>();

                foreach (var key in SupportedAttributes)
                {
                    var value = reader.GetAttribute(key);
                    if (!string.IsNullOrWhiteSpace(value))
                        attrs.Add(key, value);
                }

                for (var i = 0; i < reader.AttributeCount; i++)
                {
                    reader.MoveToAttribute(i);
                    var attrName = reader.Name;
                    if (attrName.StartsWith("data-"))
                        attrs.Add(attrName, reader.Value);
                }

                reader.MoveToContent();

                return new ContentLink(url, reader.ReadString(), attrs.AsContentParameters());
            }
        }
    }
}
