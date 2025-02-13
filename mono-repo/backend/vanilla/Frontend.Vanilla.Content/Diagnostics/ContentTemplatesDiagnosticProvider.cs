using System;
using System.Linq;
using Frontend.Vanilla.Content.Templates.DataSources;
using Frontend.Vanilla.Core.Diagnostics;

namespace Frontend.Vanilla.Content.Diagnostics;

internal sealed class ContentTemplatesDiagnosticProvider(IReflectionTemplatesSource reflectionTemplatesSource) : SyncDiagnosticInfoProvider
{
    public override DiagnosticInfoMetadata Metadata { get; } = new DiagnosticInfoMetadata(
        name: "Sitecore Content Templates",
        urlPath: "content-templates",
        shortDescription: "Displays all content templates from Sitecore mapped in the code of this app.");

    public override object GetDiagnosticInfo()
        => new
        {
            Templates = reflectionTemplatesSource.Templates
                .OrderBy(t => t.Name, StringComparer.OrdinalIgnoreCase)
                .ThenBy(t => t.Source, StringComparer.OrdinalIgnoreCase)
                .ToList(),
            Mappings = reflectionTemplatesSource.Mappings.ToDictionary(
                m => m.Key,
                m => new { m.Value.Implementation, m.Value.FieldMappings }),
        };
}
