#nullable enable

using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Content.FieldConversion;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Content.Templates.Mapping;

/// <summary>
/// Used to build mappings for a specific template.
/// </summary>
public sealed class TemplateMappingBuilder
{
    private readonly SitecoreTemplate template;
    private readonly Dictionary<TrimmedRequiredString, FieldMapping?> namedFieldMappings = new Dictionary<TrimmedRequiredString, FieldMapping?>(Document.Comparer);

    internal TemplateMappingBuilder(SitecoreTemplate template)
        => this.template = template;

    internal IReadOnlyDictionary<TrimmedRequiredString, FieldMapping?> NamedFieldMappings => namedFieldMappings;

    /// <summary>Ignores own field of this template when generating corresponding template class.</summary>
    public void IgnoreField(TrimmedRequiredString sitecoreName)
        => namedFieldMappings[sitecoreName] = null;

    /// <summary>Maps own field of this template to particular type deserialized using given converter.</summary>
    public void MapField<TField>(TrimmedRequiredString sitecoreName, IFieldConverter<TField> converter, TrimmedRequiredString? obsoleteMessage = null)
    {
        if (!template.OwnFields.Any(f => Document.Comparer.Equals(f.Name, sitecoreName)))
            throw new ArgumentException($"There is no own field '{sitecoreName}' on template '{template.Name}' {TemplateMappingProfile.FromSitecoreDisclaimer}."
                                        + $" Existing own fields: {template.OwnFields.Select(f => f.Name).Dump()}."
                                        + $" Existing inherited fields (can be customized only on respective template): {template.AllFields.Except(template.OwnFields).Select(f => f.Name).Dump()}.");

        namedFieldMappings[sitecoreName] = new FieldMapping<TField>(converter, obsoleteMessage);
    }
}
