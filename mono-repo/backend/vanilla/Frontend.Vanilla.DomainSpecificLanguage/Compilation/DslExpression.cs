using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;

namespace Frontend.Vanilla.DomainSpecificLanguage.Compilation;

/// <summary>
/// Main implementation of DSL expression.
/// </summary>
internal sealed class DslExpression<TResult> : DslExpressionBase<TResult>
    where TResult : notnull
{
    public override RequiredString OriginalString { get; }
    public IExpressionTree ExpressionTree { get; }
    public override DslExpressionMetadata Metadata { get; }
    public ITraceRecorder TraceRecorder { get; }

    public DslExpression(RequiredString originalString, IExpressionTree expressionTree, ITraceRecorder traceRecorder)
    {
        if (!typeof(TResult).IsAssignableFrom(expressionTree.ResultType.ToClrType()))
            throw new ArgumentException($"Expression tree must be of type assignable to specified expression result type {typeof(TResult)}"
                                        + $" but expression tree is {expressionTree.ResultType} - {expressionTree.ResultType.ToClrType()}.");

        OriginalString = originalString;
        ExpressionTree = expressionTree;
        TraceRecorder = traceRecorder;
        Metadata = expressionTree.CreateMetadata();
    }

    public override Task<TResult> EvaluateAsync(ExecutionMode mode)
        => EvaluateAsync(mode, DslEvaluation.FullOnServer, evaluatedExpression =>
        {
            if (!(evaluatedExpression is Literal literal))
                throw new Exception($"Full-on-server evalution must end up with final literal but there is {evaluatedExpression.GetType()} - {evaluatedExpression}.");

            return literal.GetValue<TResult>();
        });

    public override Task<ClientEvaluationResult<TResult>> EvaluateForClientAsync(ExecutionMode mode)
        => EvaluateAsync(mode, DslEvaluation.PartialForClient, evaluatedExpression =>
        {
            if (evaluatedExpression is Literal literal)
                return ClientEvaluationResult<TResult>.FromValue(literal.GetValue<TResult>()); // Upcast if needed e.g. int -> object

            var clientExpr = evaluatedExpression.SerializeToClient();

            return ClientEvaluationResult<TResult>.FromClientExpression(clientExpr);
        });

    private async Task<T> EvaluateAsync<T>(ExecutionMode mode, DslEvaluation evaluation, Func<IExpressionTree, T> transformToResult)
    {
        try
        {
            var context = new EvaluationContext(mode, evaluation, TraceRecorder.GetRecordingTrace());
            var evaluatedExpression = await ExpressionTree.EvaluateAsync(context);

            return transformToResult(evaluatedExpression);
        }
        catch (Exception ex)
        {
            const int maxLength = 100;
            var expressionStr = OriginalString.Value.Length > maxLength
                ? $"'{OriginalString.Value.Substring(0, maxLength)}...' (full version is in Data)"
                : $"'{OriginalString}'";

            var message = $"Failed {evaluation} runtime evaluation of DSL expression {expressionStr} of type {ExpressionTree.ResultType}.";

            throw new DslEvaluationException(message, ex) { Data = { { "DslExpression", OriginalString.Value } } };
        }
    }

    public override string? ToString()
        => ExpressionTree.ToString();

    public override bool Equals(object? obj)
        => obj is DslExpression<TResult> other
           && other.ExpressionTree.Equals(ExpressionTree);

    public override int GetHashCode()
        => ExpressionTree.GetHashCode();
}
