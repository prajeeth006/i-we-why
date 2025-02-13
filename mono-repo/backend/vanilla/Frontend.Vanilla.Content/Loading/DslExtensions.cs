using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Vanilla.Content.Loading;

internal static class DslExtensions
{
    /// <summary>Evaluates given DSL expressions in optimal way - in parallel.</summary>
    public static async Task<Dictionary<IDslExpression<T>, ClientEvaluationResult<T>>> EvaluateAllAsync<T>(
        this IEnumerable<IDslExpression<T>> expressions,
        ExecutionMode mode,
        ContentLoadOptions options)
    {
        var expressionsToEvaluate = expressions.Distinct().ToList(); // Evaluate each unique expression at most once b/c it's costly!!!
        ClientEvaluationResult<T>[]
            evaluatedResults; // Avoid costly async state machine allocation for each expression by getting array of results, then pairing them with expressions

        switch (options.DslEvaluation)
        {
            case DslEvaluation.FullOnServer:
                var evaluatedValues = await Task.WhenAll(expressionsToEvaluate.ConvertAll(e => e.EvaluateAsync(mode)));
                evaluatedResults = evaluatedValues.ConvertAll(ClientEvaluationResult<T>.FromValue);

                break;

            case DslEvaluation.PartialForClient:
                evaluatedResults = await Task.WhenAll(expressionsToEvaluate.ConvertAll(e => e.EvaluateForClientAsync(mode)));

                break;

            default:
                throw options.DslEvaluation.GetInvalidException();
        }

        return expressionsToEvaluate
            .ConvertAll((e, i) => KeyValue.Get(e, evaluatedResults[i]))
            .ToDictionary();
    }
}
