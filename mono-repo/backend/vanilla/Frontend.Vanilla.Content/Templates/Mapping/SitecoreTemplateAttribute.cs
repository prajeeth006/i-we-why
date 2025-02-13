using System;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Content.Templates.Mapping;

/// <summary>
/// Declares mapping and properties of the template at Sitecore side.
/// </summary>
[AttributeUsage(AttributeTargets.Interface | AttributeTargets.Class)]
public sealed class SitecoreTemplateAttribute : Attribute
{
    /// <summary>Gets the name of the template.</summary>
    public string Name { get; }

    /// <summary>Gets the mapping profile type associated with this template.</summary>
    public Type MappingProfile { get; }

    /// <summary>Creates a new instance.</summary>
    public SitecoreTemplateAttribute(string name, Type mappingProfile)
    {
        Name = Guard.TrimmedRequired(name, nameof(name));
        MappingProfile = Guard.AssignableTo<TemplateMappingProfile>(mappingProfile, nameof(mappingProfile));
    }
}
