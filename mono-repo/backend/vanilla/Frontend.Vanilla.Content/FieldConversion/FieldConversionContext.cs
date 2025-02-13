using System.Collections.Generic;
using System.Globalization;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using JetBrains.Annotations;

namespace Frontend.Vanilla.Content.FieldConversion;

/// <summary>
/// Context for converting field value.
/// </summary>
public interface IFieldConversionContext
{
    /// <summary>Gets the field value. It's null if there is no response for this field from Sitecore to save amount of transferred data.</summary>
    [CanBeNull]
    string FieldValue { get; }

    /// <summary>Gets the path of the source item.</summary>
    [NotNull]
    string SourcePath { get; }

    /// <summary>Gets the culture.</summary>
    [NotNull]
    CultureInfo Culture { get; }

    /// <summary>Gets all field values.</summary>
    [NotNull]
    IReadOnlyDictionary<string, string> AllFields { get; }

    /// <summary>Gets the factory for creating new instances of <seealso cref="DocumentId" />.</summary>
    IDocumentIdFactory DocumentIdFactory { get; }
}

internal static class FieldConversionContextExtensions
{
    public static DocumentId CreateDocumentId([NotNull] this IFieldConversionContext context, [NotNull] RequiredString pathFromCms)
        => context.DocumentIdFactory.Create(pathFromCms, context.Culture);
}

internal sealed class FieldConversionContext(
    [CanBeNull] string fieldValue,
    [NotNull] string sourcePath,
    [NotNull] CultureInfo culture,
    [NotNull] IReadOnlyDictionary<string, string> allFields,
    [NotNull] IDocumentIdFactory documentIdFactory)
    : IFieldConversionContext
{
    public string FieldValue { get; } = fieldValue;
    public string SourcePath { get; } = sourcePath;
    public CultureInfo Culture { get; } = Guard.NotNull(culture, nameof(culture));
    public IReadOnlyDictionary<string, string> AllFields { get; } = Guard.NotNull(allFields, nameof(allFields));
    public IDocumentIdFactory DocumentIdFactory { get; } = Guard.NotNull(documentIdFactory, nameof(documentIdFactory));
}
