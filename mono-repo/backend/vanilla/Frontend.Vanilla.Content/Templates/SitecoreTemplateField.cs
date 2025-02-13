using Frontend.Vanilla.Core.Utils;
using JetBrains.Annotations;

namespace Frontend.Vanilla.Content.Templates;

/// <summary>
/// Information about a template field on Sitecore side.
/// </summary>
internal sealed class SitecoreTemplateField([NotNull] string name, [NotNull] string type, bool shared)
{
    public string Name { get; } = Guard.TrimmedRequired(name, nameof(name));
    public string Type { get; } = Guard.TrimmedRequired(type, nameof(type));
    public bool Shared { get; } = shared;

    public override string ToString()
        => $"'{Name}' ('{Type}', Shared={Shared})";
}
