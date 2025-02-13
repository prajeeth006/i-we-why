using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Content.Placeholders;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Vanilla.Content.Loading.Placeholders;

/// <summary>
/// Replaces placeholders in the content document according to current context when loading them.
/// As far as DSL placeholders are user specific, result can't be cached.
/// </summary>
internal sealed class PlaceholdersJustInTimeProcessor(
    IPlaceholderReplacer replacer,
    IEnumerable<KeyValuePair<string, IFieldPlaceholderReplacer>> fieldsToReplace,
    IEnumerable<KeyValuePair<TrimmedRequiredString, IDslExpression<object>>> placeholders)
    : IJustInTimeContentProcessor
{
    public IPlaceholderReplacer Replacer { get; } = Guard.NotNull(replacer, nameof(replacer));

    public IReadOnlyDictionary<string, IFieldPlaceholderReplacer> FieldsToReplace { get; } = Guard.NotEmptyNorNullValues(
        fieldsToReplace is null ? null : EnumerableExtensions.ToDictionary(fieldsToReplace, DocumentData.FieldComparer),
        nameof(fieldsToReplace));

    public IReadOnlyDictionary<TrimmedRequiredString, IDslExpression<object>> Placeholders { get; } =
        Guard.NotEmptyNorNullItems(placeholders?.ToDictionary(), nameof(placeholders));

    public async Task<Content<IDocument>> ProcessAsync(
        ExecutionMode mode,
        SuccessContent<IDocument> content,
        ContentLoadOptions options,
        IContentLoader loader,
        Action<object> trace)
    {
        try
        {
            var toReplace = DetermineWhatToReplace(content); // B/c could have changed in the meantime e.g. b/c of filters inlined in html

            if (toReplace.Placeholders.Count == 0)
                return content;

            // Key point: evaluate all placeholders from all fields in parallel ;-)
            var evaluatedExpressions = await toReplace.Placeholders.Values.EvaluateAllAsync(mode, options);
            var evaluatedPlaceholders = toReplace.Placeholders.ToDictionary(p => p.Key, p => evaluatedExpressions[p.Value]);
            var replacedFields = ReplaceFields(content, toReplace.Fields, toReplace.ReplaceableStrings, evaluatedPlaceholders);

            return content.WithFieldsOverwritten(replacedFields);
        }
        catch (Exception ex)
        {
            return content.ToInvalid("Failed runtime replacement of placeholders."
                                     + " We can't guarantee relevant content field values. That's why it is completely Invalid."
                                     + " Error details: " + ex);
        }
    }

    private (IReadOnlyDictionary<string, IFieldPlaceholderReplacer> Fields, IReadOnlyDictionary<TrimmedRequiredString, IDslExpression<object>> Placeholders,
        IReadOnlyCollection<string> ReplaceableStrings) DetermineWhatToReplace(
            SuccessContent<IDocument> content)
    {
        var fields = new Dictionary<string, IFieldPlaceholderReplacer>(FieldsToReplace.Count, DocumentData.FieldComparer);
        var placeholders = new Dictionary<TrimmedRequiredString, IDslExpression<object>>();
        var replaceableStrings = new HashSet<string>();

        foreach (var field in FieldsToReplace)
        {
            var fieldValue = content.Document.Data.Fields[field.Key];
            var fieldReplaceableStrings = field.Value.GetReplaceableStrings(fieldValue).Where(s => s != null).Distinct().ToList();
            var fieldPlaceholders = Placeholders.Where(p => fieldReplaceableStrings.Any(s => s.Contains(p.Key))).ToList();

            if (fieldPlaceholders.Count > 0)
            {
                fields[field.Key] = field.Value;
                placeholders.Add(fieldPlaceholders, KeyConflictResolution.Overwrite);
                replaceableStrings.Add(fieldReplaceableStrings);
            }
        }

        return (fields, placeholders, replaceableStrings);
    }

    private IEnumerable<(string Name, object Value)> ReplaceFields(
        SuccessContent<IDocument> content,
        IReadOnlyDictionary<string, IFieldPlaceholderReplacer> fieldsToReplace,
        IEnumerable<string> replaceableStrings,
        IReadOnlyDictionary<TrimmedRequiredString, ClientEvaluationResult<object>> evaluatedPlaceholders)
    {
        var replacedStrings = new ReplacedStringMapping(replaceableStrings.ToDictionary(
            s => s,
            s => Replacer.Replace(s, evaluatedPlaceholders)));

        foreach (var field in fieldsToReplace)
        {
            var originalValue = content.Document.Data.Fields[field.Key];
            var replacedValue = field.Value.Recreate(originalValue, replacedStrings);

            yield return (field.Key, replacedValue);
        }
    }
}
