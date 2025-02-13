using System;
using System.Collections.Generic;
using System.Linq;
using System.Xml.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Core.Xml;
using JetBrains.Annotations;

namespace Frontend.Vanilla.Content.Templates.DataSources;

/// <summary>
/// Parses XML from Sitecore with content templates to metadata classes.
/// </summary>
internal interface ISitecoreServiceTemplatesXmlParser
{
    [NotNull, ItemNotNull]
    IReadOnlyList<SitecoreTemplate> Parse([NotNull] XElement xml, [NotNull] Action<string> trace);
}

internal sealed class SitecoreServiceTemplatesXmlParser : ISitecoreServiceTemplatesXmlParser
{
    public IReadOnlyList<SitecoreTemplate> Parse(XElement xml, Action<string> trace)
    {
        Guard.NotNull(xml, nameof(xml));
        Guard.NotNull(trace, nameof(trace));

        var dtos = xml.Elements("template").Select(templateElm =>
        {
            try
            {
                var baseTemplateIds = (templateElm.Element("base")?.Value ?? "")
                    .Split('|')
                    .Select(i => i.Trim())
                    .Where(i => i.Length > 0);
                var ownFields = templateElm
                    .Elements("section")
                    .SelectMany(s => s.Elements("field"))
                    .Select(fieldElm => new SitecoreTemplateField(
                        name: fieldElm.RequiredAttributeValue("name").Trim(),
                        type: fieldElm.RequiredAttributeValue("type").Trim(),
                        shared: fieldElm.Attribute("shared")?.Value.Trim() == "1"));
                var path = templateElm.RequiredAttributeValue("path");

                return new
                {
                    Id = templateElm.RequiredAttributeValue("id").Trim(),
                    Name = path.Substring(path.LastIndexOf('/') + 1).Trim(),
                    Source = $"Sitecore folder '{path.Substring(0, path.LastIndexOf('/')).Trim()}'",
                    BaseTemplateIds = baseTemplateIds.ToList(),
                    OwnFields = ownFields.ToList(),
                };
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed parsing template from XML: {templateElm}", ex);
            }
        }).ToList();

        var templatesById = new Dictionary<string, SitecoreTemplate>();
        dtos.Each(d => DeserializeTemplate(d.Id, null));

        if (templatesById.Values.TryFindDuplicateBy(t => t.Name, out var duplicate, StringComparer.OrdinalIgnoreCase))
            throw new Exception($"Template name is used as unique identifier but '{duplicate.Key}' is used by multiple templates: {duplicate.Join()}.");

        trace($"Parsed templates: {templatesById.Values.Select(t => t.Name).Dump()}.");

        return templatesById.Values.ToArray();

        SitecoreTemplate DeserializeTemplate(string id, object parentInfo)
        {
            if (templatesById.TryGetValue(id, out var template))
                return template;

            var dto = dtos.FirstOrDefault(d => d.Id == id);

            if (dto == null)
            {
                trace($"Warning: Template {parentInfo} refers to base template '{id}' which is missing in XML response from Sitecore. It will be skipped.");

                return null;
            }

            var baseTemplates = dto.BaseTemplateIds.Select(x => DeserializeTemplate(x, $"'{dto.Name}' from {dto.Source}")).Where(t => t != null);
            template = new SitecoreTemplate(dto.Name, dto.Source, baseTemplates, dto.OwnFields);
            templatesById.Add(dto.Id, template);

            return template;
        }
    }
}
