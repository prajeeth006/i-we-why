using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Content.FieldConversion;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Content.Templates.DataSources;
using Frontend.Vanilla.Content.Templates.Mapping;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Utils;
using JetBrains.Annotations;

namespace Frontend.Vanilla.Content.Loading.Deserialization;

/// <summary>
/// Deserializes strongly-typed document from raw string values according to mappings defined in <see cref="TemplateMappingProfile" />.
/// </summary>
internal interface IDocumentDeserializer
{
    [NotNull]
    IDocument Deserialize([NotNull] DocumentSourceData sourceData);
}

internal sealed class DocumentDeserializer(IDocumentIdFactory documentIdFactory, IReflectionTemplatesSource templatesSource, IContentConfiguration contentConfiguration)
    : IDocumentDeserializer
{
    public IDocument Deserialize(DocumentSourceData sourceData)
    {
        Guard.NotNull(sourceData, nameof(sourceData));

        if (!templatesSource.Mappings.TryGetValue(sourceData.Metadata.TemplateName, out var templateMapping))
            throw new Exception($"Unknown template '{sourceData.Metadata.TemplateName}'. Mapped templates: {templatesSource.Mappings.Keys.Dump()}.");

        var deserializedFields = new Dictionary<string, object>(DocumentData.FieldComparer);
        var configuredItemPathFields =
            contentConfiguration.ItemPathDisplayModeEnabled && contentConfiguration.ItemPathDisplayModeMapping.ContainsKey(sourceData.Metadata.TemplateName)
                ? contentConfiguration.ItemPathDisplayModeMapping[sourceData.Metadata.TemplateName]
                : new List<string>();

        foreach (var fieldName in templateMapping.FieldMappings.Keys.Where(k => configuredItemPathFields.Contains(k.ToString())))
        {
            deserializedFields[fieldName] = sourceData.Metadata.Id.Path;
        }

        foreach (var (fieldName, fieldMapping) in templateMapping.FieldMappings.Where(f => !configuredItemPathFields.Contains(f.Key.ToString()))
                     .Select(f => (f.Key, f.Value)))
        {
            var rawValue = sourceData.Fields.GetValue(fieldName); // Sitecore can skip the field if default value to save bandwidth

            try
            {
                var context = new FieldConversionContext(rawValue, sourceData.Metadata.Id.Path, sourceData.Metadata.Id.Culture, sourceData.Fields, documentIdFactory);
                deserializedFields[fieldName] = fieldMapping.Convert(context);
            }
            catch (Exception ex)
            {
                var message = $"Failed converting field '{fieldName}' to {fieldMapping.ClrType} from raw value {rawValue.Dump()}."
                              + " Most likely the value isn't according to expected contract & format so it should be investigated on Sitecore side!";

                throw new Exception(message, ex);
            }
        }

        var documentData = new DocumentData(sourceData.Metadata, deserializedFields);

        return DocumentFactory.Create(templateMapping.Implementation, documentData);
    }
}
