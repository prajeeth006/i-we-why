using System;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Content.Templates.Mapping;

/// <summary>
/// Declares mapping and properties of the template field at Sitecore side.
/// </summary>
[AttributeUsage(AttributeTargets.Property)]
public sealed class SitecoreFieldAttribute : Attribute
{
    /// <summary>Gets the name of template field.</summary>
    public string Name { get; }

    /// <summary>Gets the type of template field.</summary>
    public string Type { get; }

    /// <summary>Indicates if the field is shared between all language hence doesn't need translation.</summary>
    public bool Shared { get; }

    /// <summary>Creates a new instance.</summary>
    public SitecoreFieldAttribute(string name, string type, bool shared)
    {
        Name = Guard.TrimmedRequired(name, nameof(name));
        Type = Guard.TrimmedRequired(type, nameof(type));
        Shared = shared;
    }
}
