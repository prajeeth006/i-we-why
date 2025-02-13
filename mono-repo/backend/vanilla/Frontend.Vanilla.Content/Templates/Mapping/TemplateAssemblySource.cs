using System.Reflection;
using Frontend.Vanilla.Core.Utils;
using JetBrains.Annotations;

namespace Frontend.Vanilla.Content.Templates.Mapping;

/// <summary>
/// Represents an association of templates with their assembly.
/// </summary>
public sealed class TemplateAssemblySource
{
    /// <summary>Gets the assembly that contain content templates.</summary>
    public Assembly Assembly { get; }

    /// <summary>Gets the mapping profile to be used for templates defined in the <see cref="Assembly" />.</summary>
    public TemplateMappingProfile MappingProfile { get; }

    /// <summary>Initializes a new instance.</summary>
    public TemplateAssemblySource([NotNull] Assembly assembly, [NotNull] TemplateMappingProfile mappingProfile)
    {
        Assembly = Guard.NotNull(assembly, nameof(assembly));
        MappingProfile = Guard.NotNull(mappingProfile, nameof(mappingProfile));
    }
}
