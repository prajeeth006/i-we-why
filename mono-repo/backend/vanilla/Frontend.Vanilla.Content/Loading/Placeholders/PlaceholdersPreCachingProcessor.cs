using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Content.Placeholders;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Content.Loading.Placeholders;

/// <summary>
/// Compiles placeholders found in fields of of the content document.
/// </summary>
internal sealed class PlaceholdersPreCachingProcessor(
    IPlaceholderCompiler placeholderCompiler,
    IEnumerable<IFieldPlaceholderReplacer> fieldReplacers,
    IPlaceholderReplacer replacer,
    ILogger<PlaceholdersPreCachingProcessor> log)
    : SyncPreCachingContentProcessor
{
    private readonly IReadOnlyList<IFieldPlaceholderReplacer> fieldReplacers = fieldReplacers.ToArray();

    public override Content<IDocument> Process(SuccessContent<IDocument> content, ICollection<IJustInTimeContentProcessor> justInTimeProcessors, Action<object> trace)
    {
        try
        {
            var fieldsToReplace = new Dictionary<string, IFieldPlaceholderReplacer>(DocumentData.FieldComparer);
            var allPlaceholders = new Dictionary<TrimmedRequiredString, IDslExpression<object>>();

            foreach (var field in content.Document.Data.Fields.Where(f => f.Value != null))
            {
                var fieldReplacer = fieldReplacers.FirstOrDefault(r => r.FieldType.IsInstanceOfType(field.Value));

                if (fieldReplacer == null)
                    continue; // No associated replacer

                var fieldPlaceholders = new Dictionary<TrimmedRequiredString, IDslExpression<object>>();

                foreach (var str in fieldReplacer.GetReplaceableStrings(field.Value).Where(s => !string.IsNullOrWhiteSpace(s)).Distinct())
                {
                    var (placeholders, warnings) = placeholderCompiler.FindPlaceholders(str);
                    if (warnings.Count > 0)
                        log.LogWarning("{field} of content {id} contains placeholders with {warnings}", field.Key, content.Id, warnings.ToDebugString());

                    fieldPlaceholders.Add(placeholders, KeyConflictResolution.Overwrite);
                }

                if (fieldPlaceholders.Count > 0)
                {
                    fieldsToReplace.Add(field.Key, fieldReplacer);
                    allPlaceholders.Add(fieldPlaceholders, KeyConflictResolution.Overwrite);
                }
            }

            if (allPlaceholders.Count > 0)
                justInTimeProcessors.Add(new PlaceholdersJustInTimeProcessor(replacer, fieldsToReplace, allPlaceholders));

            return content;
        }
        catch (Exception ex)
        {
            return content.ToInvalid("Failed preparation of content placeholders: " + ex);
        }
    }
}
