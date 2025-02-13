#nullable enable

using System;
using System.Collections.Generic;
using Frontend.Vanilla.Content.Loading.Deserialization;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Content.Loading;

/// <summary>
/// Extensions used during content loading and building process.
/// </summary>
public static class ContentBuildingExtensions
{
    /// <summary>Creates a new invalid content with specified error and based on metadata from specified content.</summary>
    public static InvalidContent<IDocument> ToInvalid(this SuccessContent<IDocument> content, string error)
    {
        Guard.NotNull(content, nameof(content));
        Guard.NotNull(error, nameof(error));

        return new InvalidContent<IDocument>(content.Id, content.Metadata, error.Trim());
    }

    /// <summary>Creates a new invalid content with specified error and based on metadata from specified content.</summary>
    public static NotFoundContent<IDocument> ToNotFound(this SuccessContent<IDocument> content)
    {
        Guard.NotNull(content, nameof(content));

        return new NotFoundContent<IDocument>(content.Id);
    }

    /// <summary>Creates a new filtered content based on metadata from specified content.</summary>
    public static FilteredContent<IDocument> ToFiltered(this SuccessContent<IDocument> content)
    {
        Guard.NotNull(content, nameof(content));

        return new FilteredContent<IDocument>(content.Metadata);
    }

    /// <summary>Creates a new success content with given fields overwritten.</summary>
    public static SuccessContent<IDocument> WithFieldsOverwritten(this SuccessContent<IDocument> content, params (string Name, object? Value)[] fieldsToOverwrite)
        => content.WithFieldsOverwritten((IEnumerable<(string, object?)>)fieldsToOverwrite);

    /// <summary>Creates a new success content with given fields overwritten.</summary>
    public static SuccessContent<IDocument> WithFieldsOverwritten(this SuccessContent<IDocument> content, IEnumerable<(string Name, object? Value)> fieldsToOverwrite)
    {
        Guard.NotNull(content, nameof(content));
        Guard.NotNull(fieldsToOverwrite, nameof(fieldsToOverwrite));

        var fields = content.Document.Data.Fields.ToDictionary(DocumentData.FieldComparer);

        foreach (var field in fieldsToOverwrite)
        {
            if (field.Name == null || !fields.ContainsKey(field.Name))
            {
                var message = $"Only existing fields can be overwritten but specified field {field.Name.Dump()} doesn't exist. Existing fields: {fields.Keys.Dump()}.";

                throw new ArgumentException(message, nameof(fieldsToOverwrite));
            }

            fields[field.Name] = field.Value;
        }

        var documentType = content.Document.GetType();
        var newData = new DocumentData(content.Metadata, fields);
        var newDocument = DocumentFactory.Create(documentType, newData);

        return new SuccessContent<IDocument>(newDocument, content.ConditionResultType);
    }
}
