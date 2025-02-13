using System;
using System.IO;
using System.Linq;
using System.Xml;
using System.Xml.Linq;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Xml;

/// <summary>
/// Extensions methods for <see cref="XElement" />.
/// </summary>
internal static class XElementExtensions
{
    public static byte[] ToBytes(this XElement xml)
    {
        var memory = new MemoryStream();
        var settings = new XmlWriterSettings { OmitXmlDeclaration = true, NamespaceHandling = NamespaceHandling.OmitDuplicates }; // To minimize size
        using (var writer = XmlWriter.Create(memory, settings))
            xml.Save(writer);

        return memory.ToArray();
    }

    public static string? AttributeValue(this XElement xml, XName name)
        => xml.Attribute(name)?.Value;

    public static string RequiredAttributeValue(this XElement xml, XName name)
    {
        var attr = xml.Attribute(name)
                   ?? throw new RequiredXmlAttributeException($"Missing required attribute '{name}' on element <{xml.Name}>."
                                                              + $" Existing attributes: {xml.Attributes().Select(a => a.Name.ToString()).Dump()}.");

        return !string.IsNullOrWhiteSpace(attr.Value)
            ? attr.Value
            : throw new RequiredXmlAttributeException($"Value of attribute '{name}' on element <{xml.Name}> is required but it's null or white-space.");
    }
}

internal sealed class RequiredXmlAttributeException(string? message = null) : InvalidOperationException(message) { }
