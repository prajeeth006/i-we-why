using System;
using System.Collections.Generic;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.DomainSpecificLanguage;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Content.Loading.FilterCondition;

/// <summary>
/// Compiles DSL filter expression in <see cref="IFilterTemplate.Condition" /> field.
/// </summary>
internal sealed class FilterConditionPreCachingProcessor(IDslCompiler dslCompiler, ILogger<FilterConditionPreCachingProcessor> log) : SyncPreCachingContentProcessor
{
    public override Content<IDocument> Process(SuccessContent<IDocument> content, ICollection<IJustInTimeContentProcessor> justInTimeProcessors, Action<object> trace)
    {
        if (!(content.Document is IFilterTemplate filterableDocument))
        {
            trace?.Invoke(TraceMessages.NotFilterable);

            return content;
        }

        var rawCondition = filterableDocument.Condition;

        try
        {
            // Collapse white-space to null to make it clear that condition was processed
            var cleanedContent = content.WithFieldsOverwritten((nameof(IFilterTemplate.Condition), null));

            if (string.IsNullOrWhiteSpace(rawCondition))
            {
                trace?.Invoke(TraceMessages.EmptyCondition);

                return cleanedContent;
            }

            trace?.Invoke($"Compiling filter Condition '{rawCondition}' to DSL expression.");
            var (condition, warnings) = dslCompiler.Compile<bool>(rawCondition);

            trace?.Invoke($"Compiled to following DSL expression with {(warnings.Count > 0 ? "following" : "no")} warnings.");
            trace?.Invoke(condition);

            if (warnings.Count > 0)
            {
                trace?.Invoke(warnings);
                log.LogWarning("Content {id} contains {condition} with {warnings}", content.Id, rawCondition, warnings.ToDebugString());
            }

            justInTimeProcessors.Add(new FilterConditionJustInTimeProcessor(condition));

            return cleanedContent;
        }
        catch (Exception ex)
        {
            trace?.Invoke($"Failed preparation of filter Condition: {ex}");

            return content.ToInvalid($"Failed preparation of filter Condition '{rawCondition}' with details: {ex}");
        }
    }

    public static class TraceMessages
    {
        public static readonly string NotFilterable = $"No filtering because the content doesn't implement {typeof(IFilterTemplate)}.";
        public static readonly string EmptyCondition = $"No filtering because {nameof(IFilterTemplate.Condition)} of the content is null or white-space.";
        public static readonly string ErrorPrefix = $"Failed preparation of filter {nameof(IFilterTemplate.Condition)}: ";
    }
}
