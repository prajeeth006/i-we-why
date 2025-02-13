using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Vanilla.Content.Loading.FilterCondition;

/// <summary>
/// Filters the content based on compiled DSL expression in <see cref="IFilterTemplate.Condition" /> field.
/// As far as DSL expression is user specific, result can't be cached.
/// </summary>
internal sealed class FilterConditionJustInTimeProcessor(IDslExpression<bool> dslCondition) : IJustInTimeContentProcessor
{
    public IDslExpression<bool> DslCondition { get; } = Guard.NotNull(dslCondition, nameof(dslCondition));

    public async Task<Content<IDocument>> ProcessAsync(
        ExecutionMode mode,
        SuccessContent<IDocument> content,
        ContentLoadOptions options,
        IContentLoader loader,
        Action<object> trace)
    {
        try
        {
            trace?.Invoke($"Filtering {options.DslEvaluation} by following DSL condition.");
            trace?.Invoke(DslCondition);

            switch (options.DslEvaluation)
            {
                case DslEvaluation.FullOnServer:
                    var passed = await DslCondition.EvaluateAsync(mode);
                    content.ConditionResultType = DslEvaluation.FullOnServer;

                    return ApplyFilter(passed);

                case DslEvaluation.PartialForClient:
                    var evalResult = await DslCondition.EvaluateForClientAsync(mode);

                    if (evalResult.HasFinalValue)
                    {
                        content.ConditionResultType = DslEvaluation.FullOnServer;

                        return ApplyFilter(evalResult.Value);
                    }

                    // No final value -> filtering on client is needed -> replace Condition field
                    content.ConditionResultType = DslEvaluation.PartialForClient;
                    trace?.Invoke($"DSL condition evaluated to client-side expression: '{evalResult.ClientExpression}'.");

                    return content.WithFieldsOverwritten((nameof(IFilterTemplate.Condition), evalResult.ClientExpression));

                default:
                    throw options.DslEvaluation.GetInvalidException();
            }
        }
        catch (Exception ex)
        {
            trace?.Invoke(TraceMessages.ErrorPrefix + ex);

            return content.ToInvalid($"Failed {options.DslEvaluation} filter evaluation: {ex}");
        }

        Content<IDocument> ApplyFilter(bool passed)
        {
            if (!passed)
            {
                trace?.Invoke(TraceMessages.Filtered);

                return content.ToFiltered();
            }

            trace?.Invoke(TraceMessages.Passed);

            return content;
        }
    }

    public static class TraceMessages
    {
        public const string Passed = "Filtering is passed because DSL Condition evaluated to true.";
        public const string Filtered = "Filtered out because DSL Condition evaluated to false.";
        public const string ErrorPrefix = "Failed filter evaluation: ";
    }
}
