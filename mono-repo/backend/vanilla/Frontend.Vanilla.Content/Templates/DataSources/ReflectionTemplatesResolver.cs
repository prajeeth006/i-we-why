using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Frontend.Vanilla.Content.Templates.Mapping;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using JetBrains.Annotations;

namespace Frontend.Vanilla.Content.Templates.DataSources;

/// <summary>
/// Loads Sitecore template definitions from already compiled template code.
/// </summary>
internal interface IReflectionTemplatesResolver
{
    [NotNull, ItemNotNull]
    IEnumerable<ReflectedTemplate> Resolve([NotNull] TemplateAssemblySource assemblySource, [NotNull, ItemNotNull] IEnumerable<ReflectedTemplate> externalBaseTemplates);
}

internal sealed class ReflectedTemplate
{
    public SitecoreTemplate Template { get; }
    public Type Interface { get; }
    public Type Implementation { get; }

    public ReflectedTemplate([NotNull] SitecoreTemplate template, [NotNull] Type @interface, [NotNull] Type implementation)
    {
        Template = Guard.NotNull(template, nameof(template));
        Interface = Guard.Interface(@interface, nameof(@interface));
        Implementation = Guard.FinalClass(implementation, nameof(implementation));

        if (!@interface.IsAssignableFrom(implementation))
            throw new ArgumentException($"Specified implementation {implementation} doesn't implement specified interface {@interface}.");
    }
}

internal sealed class ReflectionTemplatesResolver : IReflectionTemplatesResolver
{
    public IEnumerable<ReflectedTemplate> Resolve(TemplateAssemblySource assemblySource, IEnumerable<ReflectedTemplate> externalBaseTemplates)
    {
        Guard.NotNull(assemblySource, nameof(assemblySource));
        externalBaseTemplates = Guard.NotNullItems(externalBaseTemplates?.Enumerate(), nameof(externalBaseTemplates));

        try
        {
            var mappingProfileType = assemblySource.MappingProfile.GetType();
            var implementationsWithAttribute = assemblySource.Assembly
                .GetTypes()
                .Where(t => t.IsFinalClass() && typeof(Document).IsAssignableFrom(t))
                .Select(t => new { Type = t, Attribute = t.GetRequired<SitecoreTemplateAttribute>() })
                .Where(x => x.Attribute.MappingProfile == mappingProfileType)
                .ToList();

            if (implementationsWithAttribute.Count == 0)
                throw new Exception("No template classes found. Have you generated them already?");

            var templatesDataByInterface = implementationsWithAttribute
                .Select(implementation =>
                {
                    var interfacesWithAttribute = implementation.Type.GetInterfaces()
                        .Select(t => new { Type = t, Attribute = t.Get<SitecoreTemplateAttribute>() })
                        .Where(t => t.Attribute != null)
                        .ToList();

                    var primaryInterface = interfacesWithAttribute.Single(i => i.Attribute.Name.EqualsIgnoreCase(implementation.Attribute.Name)).Type;
                    var ownFields = primaryInterface
                        .GetProperties()
                        .Select(p => implementation.Type.GetRequired<PropertyInfo>(p.Name))
                        .Select(p => p.GetRequired<SitecoreFieldAttribute>())
                        .Select(a => new SitecoreTemplateField(a.Name, a.Type, a.Shared));

                    return new
                    {
                        implementation.Attribute.Name,
                        Implementation = implementation.Type,
                        Interface = primaryInterface,
                        OwnFields = ownFields,
                        BaseInterfaces = interfacesWithAttribute.Select(i => i.Type).Except(primaryInterface),
                    };
                })
                .ToDictionary(d => d.Interface);

            var resultByInterface = new Dictionary<Type, ReflectedTemplate>();
            var externalBaseTemplatesByInterface = externalBaseTemplates.ToDictionary(t => t.Interface);

            foreach (var @interface in templatesDataByInterface.Keys)
                GetOrBuildTemplate(@interface);

            return resultByInterface.Values;

            SitecoreTemplate GetOrBuildTemplate(Type @interface)
            {
                if (externalBaseTemplatesByInterface.TryGetValue(@interface, out var external))
                    return external.Template;

                if (resultByInterface.TryGetValue(@interface, out var alreadyBuilt))
                    return alreadyBuilt.Template;

                var data = templatesDataByInterface[@interface];
                var baseTemplates = data.BaseInterfaces.Select(GetOrBuildTemplate);
                var template = new SitecoreTemplate(data.Name, data.Implementation.ToString(), baseTemplates, data.OwnFields);

                resultByInterface.Add(@interface, new ReflectedTemplate(template, @interface, data.Implementation));

                return template;
            }
        }
        catch (Exception ex)
        {
            throw new Exception($"Failed reflecting content templates from {assemblySource.Assembly} based on {assemblySource.MappingProfile.GetType()}.", ex);
        }
    }
}
