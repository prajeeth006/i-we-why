using System;
using System.Collections.Generic;
using System.Linq;
using System.Xml.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Content.Templates.DataSources;

/// <summary>
/// Adds folder template because Sitecore returns folders in content response but in a request for templates it's missing.
/// </summary>
internal sealed class FolderHackTemplatesXmlParser(ISitecoreServiceTemplatesXmlParser inner) : ISitecoreServiceTemplatesXmlParser
{
    public const string TemplateName = "Folder";
    public const string Source = "(added automatically by Vanilla)";

    public IReadOnlyList<SitecoreTemplate> Parse(XElement xml, Action<string> trace)
    {
        var templates = inner.Parse(xml, trace);

        if (templates.Any(t => t.Name.EqualsIgnoreCase(TemplateName)))
            return templates;

        var folderTemplate = new SitecoreTemplate(TemplateName, Source, Array.Empty<SitecoreTemplate>(), Array.Empty<SitecoreTemplateField>());

        return EnumerableExtensions.Append(templates, folderTemplate).ToList();
    }
}
