using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Utils;
using JetBrains.Annotations;

namespace Frontend.Vanilla.Content.Templates;

/// <summary>
/// Information about a template on Sitecore side.
/// </summary>
internal sealed class SitecoreTemplate
{
    public string Name { get; }
    public string Source { get; }
    public IReadOnlyList<SitecoreTemplate> BaseTemplates { get; }
    public IReadOnlyList<SitecoreTemplateField> OwnFields { get; }
    public IReadOnlyList<SitecoreTemplateField> AllFields { get; }

    public SitecoreTemplate(
        [NotNull] string name,
        [NotNull] string source,
        [NotNull, ItemNotNull] IEnumerable<SitecoreTemplate> baseTemplates,
        [NotNull, ItemNotNull] IEnumerable<SitecoreTemplateField> ownFields)
    {
        Guard.TrimmedRequired(name, nameof(name));
        Name = Guard.Requires(name, n => n.IndexOfAny(new[] { '/', '\\' }) < 0, nameof(name), "Name can't contain a slash.");
        Source = Guard.TrimmedRequired(source, nameof(source));
        BaseTemplates = Guard.NotNullItems(baseTemplates
                ?.SelectMany(GetWithAllBaseTemplates)
                .Distinct()
                .ToArray()
                .AsReadOnly(),
            nameof(baseTemplates));
        OwnFields = Guard.NotNullItems(ownFields
                ?.ToArray()
                .AsReadOnly(),
            nameof(ownFields));
        AllFields = BaseTemplates
            .SelectMany(t => t.OwnFields)
            .Concat(OwnFields)
            .ToArray()
            .AsReadOnly();

        if (AllFields.TryFindDuplicateBy(f => f.Name, out var duplicate, StringComparer.OrdinalIgnoreCase))
            throw new ArgumentException(
                $"Field names must be unique but there are: {duplicate.Select(f => $"'{f.Name}' ({f.Type}, Shared={f.Shared})").Join(" vs. ")}.");
    }

    private static IEnumerable<SitecoreTemplate> GetWithAllBaseTemplates(SitecoreTemplate template)
        => template.BaseTemplates.SelectMany(GetWithAllBaseTemplates).Append(template);

    public override string ToString()
        => $"'{Name}' from {Source}";
}
