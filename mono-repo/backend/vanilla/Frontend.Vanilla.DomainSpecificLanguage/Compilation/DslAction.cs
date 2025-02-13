using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.DomainSpecificLanguage.Compilation;

/// <summary>
/// Delegates action execution to void <see cref="IDslExpression{TResult}" />.
/// </summary>
internal sealed class DslAction(IDslExpression<VoidDslResult> expression) : IDslAction
{
    public IDslExpression<VoidDslResult> Expression { get; } = expression;

    public RequiredString OriginalString => Expression.OriginalString;
    public DslExpressionMetadata Metadata => Expression.Metadata;

    public void Execute()
        => Expression.Evaluate();

    public Task ExecuteAsync(CancellationToken cancellationToken)
        => Expression.EvaluateAsync(cancellationToken);

    public Task ExecuteAsync(ExecutionMode mode)
        => Expression.EvaluateAsync(mode);

    public string? ExecuteToClientScript()
    {
        var result = Expression.EvaluateForClient();

        return !result.HasFinalValue ? result.ClientExpression : null;
    }

    public async Task<string?> ExecuteToClientScriptAsync(CancellationToken cancellationToken)
    {
        var result = await Expression.EvaluateForClientAsync(cancellationToken);

        return !result.HasFinalValue ? result.ClientExpression : null;
    }

    public async Task<string?> ExecuteToClientScriptAsync(ExecutionMode mode)
    {
        var result = await Expression.EvaluateForClientAsync(mode);

        return !result.HasFinalValue ? result.ClientExpression : null;
    }

    public override string? ToString()
        => Expression.ToString();

    public override bool Equals(object? obj)
        => obj is DslAction other
           && other.Expression.Equals(Expression);

    public override int GetHashCode()
        => Expression.GetHashCode();
}
