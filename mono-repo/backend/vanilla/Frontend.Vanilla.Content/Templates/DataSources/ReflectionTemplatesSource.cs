using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Content.FieldConversion;
using Frontend.Vanilla.Content.Templates.Mapping;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Content.Templates.DataSources;

/// <summary>
/// Loads all Sitecore templates from already compiled template code and maps them.
/// </summary>
internal interface IReflectionTemplatesSource
{
    IReadOnlyList<SitecoreTemplate> Templates { get; }
    IReadOnlyDictionary<TrimmedRequiredString, (Type Implementation, IReadOnlyDictionary<TrimmedRequiredString, FieldMapping> FieldMappings)> Mappings { get; }
}

internal sealed class ReflectionTemplatesSource : IReflectionTemplatesSource
{
    public IReadOnlyList<SitecoreTemplate> Templates { get; }
    public IReadOnlyDictionary<TrimmedRequiredString, (Type Implementation, IReadOnlyDictionary<TrimmedRequiredString, FieldMapping> FieldMappings)> Mappings { get; }

    public ReflectionTemplatesSource(IReflectionTemplatesResolver reflectionTemplatesResolver, IEnumerable<TemplateAssemblySource> assemblySources)
    {
        var resultTemplates = new List<SitecoreTemplate>();
        var resultMappings = new Dictionary<TrimmedRequiredString, (Type, IReadOnlyDictionary<TrimmedRequiredString, FieldMapping>)>(Document.Comparer);
        Templates = resultTemplates;
        Mappings = resultMappings;

        // Split Vanilla vs others
        var otherAssemblySources = assemblySources.ToList();
        var vanillaAssemblySource = otherAssemblySources.Single(s => s.Assembly.FullName.StartsWith("Frontend.Vanilla.Content"));
        otherAssemblySources.Remove(vanillaAssemblySource);

        // Map Vanilla
        var vanillaTemplates = reflectionTemplatesResolver.Resolve(vanillaAssemblySource, Array.Empty<ReflectedTemplate>()).Enumerate();
        var vanillaMappings = vanillaAssemblySource.MappingProfile.MapTemplates(vanillaTemplates.Select(t => t.Template));
        AddResult(vanillaTemplates, vanillaMappings);

        // Map others
        foreach (var assemblySource in otherAssemblySources)
        {
            var templates = reflectionTemplatesResolver.Resolve(assemblySource, vanillaTemplates).Enumerate();
            var templateMappings =
                assemblySource.MappingProfile.MapTemplates(templates.Concat(vanillaTemplates)
                    .Select(t => t.Template)); // Include mapping of Vanilla fields for inherited templates
            AddResult(templates, templateMappings);
        }

        void AddResult(IReadOnlyList<ReflectedTemplate> reflectedTemplates,
            IReadOnlyDictionary<TrimmedRequiredString, IReadOnlyDictionary<TrimmedRequiredString, FieldMapping>> templateMappings)
        {
            resultTemplates.Add(reflectedTemplates.Select(t => t.Template));

            foreach (var (templateName, fieldMappings) in templateMappings.Select(x => (x.Key, x.Value)))
            {
                if (resultMappings.ContainsKey(templateName) && vanillaTemplates.Any(t => t.Template.Name.EqualsIgnoreCase(templateName)))
                    continue; // Shortcoming: base Vanilla templates are mapped each time -> skip

                var implementation = reflectedTemplates.Single(t => Document.Comparer.Equals(t.Template.Name, templateName)).Implementation;
                resultMappings.Add(templateName, (implementation, fieldMappings));
            }
        }
    }
}
