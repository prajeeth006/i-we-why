#nullable enable

using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Content.FieldConversion;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Content.Templates.Mapping;

/// <summary>
/// Represents a mapping for raw template and field definitions of the underlying CMS to CLR types. This class is abstract.
/// </summary>
public abstract class TemplateMappingProfile
{
    internal const string MappingMessage = "Mapping is most likely done in base class hence it must be kept to correctly map templates inherited from Vanilla.";
    internal const string FromSitecoreDisclaimer = "(coming from Sitecore according to your config during template generation)";

    /// <summary>Defines generic mapping for fields of the specified type.</summary>
    protected void MapFieldsOfType<TField>(TrimmedRequiredString sitecoreType, IFieldConverter<TField> converter, TrimmedRequiredString? obsoleteMessage = null)
    {
        if (typedFieldMappings.TryGetValue(sitecoreType, out var existing))
            throw new ArgumentException(
                $"Fields of given type '{sitecoreType}' can't be mapped using {converter} because they are already mapped using {existing}. {MappingMessage}");

        typedFieldMappings[sitecoreType] = new FieldMapping<TField>(converter, obsoleteMessage);
    }

    /// <summary>Customizes mapping of fields of particular template.</summary>
    protected void MapTemplate(TrimmedRequiredString templateName, Action<TemplateMappingBuilder> mappingFunction)
    {
        Guard.TrimmedRequired(templateName, nameof(templateName));
        Guard.NotNull(mappingFunction, nameof(mappingFunction));

        if (!templatesByName.TryGetValue(templateName, out var template))
            throw new ArgumentException($"Given template '{templateName}' wasn't found within available templates {FromSitecoreDisclaimer}."
                                        + $" Existing templates: {templatesByName.Keys.Dump()}.");

        if (namedTemplateMappings.TryGetValue(templateName, out var alreadyMapped))
            throw new ArgumentException(
                $"Given template '{templateName}' is already mapped - fields: {alreadyMapped?.Keys.Dump() ?? "(ignored template)"}. {MappingMessage}");

        var builder = new TemplateMappingBuilder(template);
        mappingFunction(builder);
        namedTemplateMappings[templateName] = builder.NamedFieldMappings;
    }

    /// <summary>Ignores whole template when generating template classes.</summary>
    protected void IgnoreTemplate(TrimmedRequiredString templateName)
        => namedTemplateMappings[templateName] = null;

    /// <summary>Create custom mapping of templates and template fields.</summary>
    protected abstract void OnMap();

    // Temporary fields so that we can collect values set up during OnMap()
#pragma warning disable CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.
    private IReadOnlyDictionary<TrimmedRequiredString, SitecoreTemplate> templatesByName;
    private IDictionary<TrimmedRequiredString, FieldMapping> typedFieldMappings;
    private IDictionary<TrimmedRequiredString, IReadOnlyDictionary<TrimmedRequiredString, FieldMapping?>?> namedTemplateMappings;
#pragma warning restore CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.

    internal virtual IReadOnlyDictionary<TrimmedRequiredString, IReadOnlyDictionary<TrimmedRequiredString, FieldMapping>> MapTemplates(
        IEnumerable<SitecoreTemplate> templates)
    {
        // ReSharper disable once RedundantCast
        templatesByName = Enumerable.ToDictionary(templates, t => (TrimmedRequiredString)t.Name, Document.Comparer);
        typedFieldMappings = new Dictionary<TrimmedRequiredString, FieldMapping>(Document.Comparer);
        namedTemplateMappings = new Dictionary<TrimmedRequiredString, IReadOnlyDictionary<TrimmedRequiredString, FieldMapping?>?>(Document.Comparer);

        // Apply consumer's mappings
        OnMap();

        var resultMappings = new Dictionary<TrimmedRequiredString, IReadOnlyDictionary<TrimmedRequiredString, FieldMapping>>(Document.Comparer);

        foreach (var template in templatesByName.Values)
        {
            if (namedTemplateMappings.TryGetValue(template.Name, out var namedFieldMappings) && namedFieldMappings == null) // If ignored template -> skip
                continue;

            var baseIgnoredFields = template.BaseTemplates
                .Where(t => namedTemplateMappings.TryGetValue(t.Name, out var ignored) && ignored == null)
                .SelectMany(t => (templatesByName.GetValue(t.Name)?.OwnFields).NullToEmpty())
                .Select(f => f.Name)
                .ToHashSet();

            var baseNamedFieldMappings = EnumerableExtensions.ToDictionary(template.BaseTemplates.SelectMany(t => namedTemplateMappings.GetValue(t.Name).NullToEmpty()),
                Document.Comparer);
            namedFieldMappings = namedFieldMappings ?? new Dictionary<TrimmedRequiredString, FieldMapping?>();

            var resultFieldMappings = new Dictionary<TrimmedRequiredString, FieldMapping>(Document.Comparer);
            resultMappings.Add(template.Name, resultFieldMappings);

            foreach (var field in template.AllFields.Where(f => !resultFieldMappings.ContainsKey(f.Name)))
            {
                FieldMapping? fieldMappings = null;
                var isMapped = baseIgnoredFields.Contains(field.Name)
                               || namedFieldMappings.TryGetValue(field.Name, out fieldMappings)
                               || baseNamedFieldMappings.TryGetValue(field.Name, out fieldMappings)
                               || typedFieldMappings.TryGetValue(field.Type, out fieldMappings);

                if (!isMapped)
                    throw new Exception($"There is no suitable mapping for field {field} of template '{template.Name}'."
                                        + $" Are your content templates up-to-date? You can also MapTemplate('{template.Name}', t => t.IgnoreField('{field.Name}'))."
                                        + $" Explicitly mapped fields of this template: {namedFieldMappings.Keys.Dump()}."
                                        + $" Inherited explicitly mapped fields: {baseNamedFieldMappings.Keys.Dump()}."
                                        + $" Mapped field types: {typedFieldMappings.Keys.Dump()}.");

                if (fieldMappings != null) // Ignored ignored field -> skip
                    resultFieldMappings.Add(field.Name, fieldMappings);
            }
        }

        return resultMappings;
    }
}
