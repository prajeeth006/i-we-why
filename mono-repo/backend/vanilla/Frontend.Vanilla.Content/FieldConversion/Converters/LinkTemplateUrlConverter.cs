#nullable enable

using System;
using System.Xml.Linq;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Content.FieldConversion.Converters;

/// <summary>
/// Special handling for parsing out a URL for <see cref="ILinkTemplate" />.
/// </summary>
internal sealed class LinkTemplateUrlConverter : IFieldConverter<Uri?>
{
    public static class Fields
    {
        public const string Url = "Url";
        public const string LocalizedUrl = "LocalizedUrl";
        public const string Link = "Link";
    }

    public Uri? Convert(IFieldConversionContext context)
        => ParseUrl(context.AllFields.GetValue(Fields.LocalizedUrl), Fields.LocalizedUrl, u => u)
           ?? ParseUrl(context.FieldValue, Fields.Url, u => u)
           ?? ParseUrl(context.AllFields.GetValue(Fields.Link), Fields.Link, ParseLinkHref);

    private static Uri? ParseUrl(string? fieldValue, string fieldName, Func<string, string> extractUrl)
    {
        if (fieldValue.IsNullOrWhiteSpace())
            return null;

        var rawUrl = extractUrl(fieldValue);

        return Uri.TryCreate(rawUrl, UriKind.RelativeOrAbsolute, out var url)
            ? url
            : throw new Exception($"Invalid URL (absolute or relative) in field '{fieldName}' with value '{fieldValue}'.");
    }

    private static string ParseLinkHref(string linkHtml)
    {
        try
        {
            var linkXml = XElement.Parse(linkHtml);

            return (string)linkXml.Attribute("href")!;
        }
        catch (Exception ex)
        {
            throw new Exception($"Invalid XML in '{Fields.Link}' field with value '{linkHtml}'.", ex);
        }
    }
}
