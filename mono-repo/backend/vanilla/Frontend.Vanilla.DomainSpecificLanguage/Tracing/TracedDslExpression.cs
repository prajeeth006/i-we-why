using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage.Compilation;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Newtonsoft.Json;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tracing;

/// <summary>
/// Records all details of DSL expression execution for tracing purposes.
/// </summary>
internal sealed class TracedDslExpression<T>(IDslExpression<T> inner, ITraceRecorder traceRecorder) : DslExpressionBase<T>
    where T : notnull
{
    public IDslExpression<T> Inner { get; } = inner;
    public ITraceRecorder TraceRecorder { get; } = traceRecorder;

    public override RequiredString OriginalString => Inner.OriginalString;
    public override DslExpressionMetadata Metadata => Inner.Metadata;

    public override Task<T> EvaluateAsync(ExecutionMode mode)
    {
        var trace = TraceRecorder.GetRecordingTrace();

        return trace != null
            ? TraceAsync(mode, Inner.EvaluateAsync, DslEvaluation.FullOnServer, trace, r => r)
            : Inner.EvaluateAsync(mode);
    }

    public override Task<ClientEvaluationResult<T>> EvaluateForClientAsync(ExecutionMode mode)
    {
        var trace = TraceRecorder.GetRecordingTrace();

        return trace != null
            ? TraceAsync(mode, Inner.EvaluateForClientAsync, DslEvaluation.PartialForClient, trace, TransformClientResult)
            : Inner.EvaluateForClientAsync(mode);
    }

    private static object TransformClientResult(ClientEvaluationResult<T> result)
        => result.HasFinalValue
            ? new { result.HasFinalValue, result.Value }
            : new { result.HasFinalValue, result.ClientExpression };

    private async Task<TResult> TraceAsync<TResult>(
        ExecutionMode mode,
        Func<ExecutionMode, Task<TResult>> evaluateAsync,
        DslEvaluation evaluation,
        IRecordingTrace trace,
        Func<TResult, object?> transformResult)
    {
        try
        {
            var result = await evaluateAsync(mode);

            var resultJson = JsonConvert.SerializeObject(transformResult(result));
            Record("success", exception: null, ("evaluationResult", resultJson));

            return result;
        }
        catch (Exception ex)
        {
            Record("failure", ex);

            throw;
        }

        void Record(string status, Exception? exception, params (string, object?)[] values)
            => trace.Record($"DSL expression {status}: {OriginalString}", exception, new Dictionary<string, object?>
            {
                { "expression", OriginalString.Value },
                { "evaluation", evaluation.ToString() },
                { "executionMode", mode.ToString() },
                values,
            });
    }

    public override string? ToString()
        => Inner.ToString();

    public override bool Equals(object? obj)
        => obj is TracedDslExpression<T> other
           && Inner.Equals(other.Inner);

    public override int GetHashCode()
        => Inner.GetHashCode();
}
