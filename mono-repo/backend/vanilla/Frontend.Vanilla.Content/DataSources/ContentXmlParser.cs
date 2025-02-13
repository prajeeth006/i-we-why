#nullable enable

using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Xml.Linq;
using Frontend.Vanilla.Content.Loading;
using Frontend.Vanilla.Content.Loading.XmlSources;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Xml;

namespace Frontend.Vanilla.Content.DataSources;

internal interface IContentXmlParser
{
    WithPrefetched<DocumentSourceData> ParseData(
        XElement xml,
        CultureInfo requestedCulture,
        TrimmedRequiredString requestedSitecoreLanguage,
        uint depthToParse,
        UtcDateTime sitecoreLoadTime);
}

internal sealed class ContentXmlParser(IDocumentIdFactory documentIdFactory) : IContentXmlParser
{
    public WithPrefetched<DocumentSourceData> ParseData(
        XElement xml,
        CultureInfo requestedCulture,
        TrimmedRequiredString requestedSitecoreLanguage,
        uint totalDepthToParse,
        UtcDateTime sitecoreLoadTime)
    {
        try
        {
            var rootItemXmls = xml.Elements(ContentXml.ItemElement).ToList();

            if (rootItemXmls.Count != 1)
                throw new Exception($"There must be a single root '{ContentXml.ItemElement}' but there are {rootItemXmls.Count} of them.");

            var requestedItem = ParseItem(rootItemXmls[0]);
            var prefetchedItems = ParseChildren(rootItemXmls[0], totalDepthToParse);

            return new WithPrefetched<DocumentSourceData>(requestedItem, prefetchedItems);
        }
        catch (Exception ex)
        {
            throw new Exception("Content XML returned from Sitecore isn't according to expected contract: " + xml, ex);
        }

        DocumentSourceData ParseItem(XElement itemXml)
        {
            var templateName = itemXml.RequiredAttributeValue("template").Trim();
            var versionStr = itemXml.RequiredAttributeValue("version").Trim();

            if (!int.TryParse(versionStr, out var version)) throw new Exception($"Failed parsing version number from string '{versionStr}'.");

            var id = ParseDocumentId(itemXml);
            var childIds = itemXml.Elements(ContentXml.ItemElement).Select(ParseDocumentId);

            var fields = new Dictionary<string, string?>(DocumentData.FieldComparer);

            foreach (var fieldXml in (itemXml.Element("fields")?.Elements("field")).NullToEmpty())
            {
                var name = fieldXml.RequiredAttributeValue("key").Trim();
                var value = fieldXml.Element("content")?.Value;
                fields.Add(name, value);
            }

            var metadata = new DocumentMetadata(id, templateName, version, childIds, sitecoreLoadTime, fields.ContainsKey("condition"));

            return new DocumentSourceData(metadata, fields);
        }

        IEnumerable<DocumentSourceData> ParseChildren(XElement itemXml, uint currentDepthToParse)
        {
            if (currentDepthToParse == 0)
                yield break;

            foreach (var childXml in itemXml.Elements(ContentXml.ItemElement))
            {
                yield return ParseItem(childXml);

                foreach (var child in ParseChildren(childXml, currentDepthToParse - 1))
                    yield return child;
            }
        }

        DocumentId ParseDocumentId(XElement itemXml)
        {
            var id = itemXml.RequiredAttributeValue("id");
            var path = itemXml.RequiredAttributeValue("path");
            var actualLanguage = itemXml.RequiredAttributeValue("language");

            return requestedSitecoreLanguage.EqualsIgnoreCase(actualLanguage)
                ? documentIdFactory.Create(path, requestedCulture, id)
                : throw new Exception($"Requested language is '{requestedSitecoreLanguage}' but response XML contains item(s) with '{actualLanguage}'.");
        }
    }
}
