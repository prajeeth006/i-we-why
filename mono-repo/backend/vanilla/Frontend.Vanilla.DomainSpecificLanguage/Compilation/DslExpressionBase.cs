using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage.Json;
using Newtonsoft.Json;

namespace Frontend.Vanilla.DomainSpecificLanguage.Compilation;

/// <summary>
/// Base class which collapses sync + async methods to one with <see cref="ExecutionMode" />.
/// </summary>
[JsonConverter(typeof(DslExpressionDiagnosticJsonConverter))]
internal abstract class DslExpressionBase<TResult> : IDslExpression<TResult>
    where TResult : notnull
{
    TResult IDslExpression<TResult>.Evaluate()
        => ExecutionMode.ExecuteSync(EvaluateAsync);

    Task<TResult> IDslExpression<TResult>.EvaluateAsync(CancellationToken cancellationToken)
        => EvaluateAsync(ExecutionMode.Async(cancellationToken));

    ClientEvaluationResult<TResult> IDslExpression<TResult>.EvaluateForClient()
        => ExecutionMode.ExecuteSync(EvaluateForClientAsync);

    Task<ClientEvaluationResult<TResult>> IDslExpression<TResult>.EvaluateForClientAsync(CancellationToken cancellationToken)
        => EvaluateForClientAsync(ExecutionMode.Async(cancellationToken));

    public abstract DslExpressionMetadata Metadata { get; }
    public abstract RequiredString OriginalString { get; }
    public abstract Task<TResult> EvaluateAsync(ExecutionMode mode);
    public abstract Task<ClientEvaluationResult<TResult>> EvaluateForClientAsync(ExecutionMode mode);
}
