using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.DomainSpecificLanguage;

/// <summary>
/// An expression written in Vanilla domain specific language.
/// </summary>
public interface IDslExpression<TResult>
    where TResult : notnull
{
    /// <summary>Gets the original string used to construct the expression.</summary>
    RequiredString OriginalString { get; }

    /// <summary>Gets the metadata.</summary>
    DslExpressionMetadata Metadata { get; }

    /// <summary>Fully evaluates the expression on server.</summary>
    TResult Evaluate();

    /// <summary>Fully evaluates the expression on server.</summary>
    Task<TResult> EvaluateAsync(CancellationToken cancellationToken);

    /// <summary>Fully evaluates the expression on server.</summary>
    Task<TResult> EvaluateAsync(ExecutionMode mode);

    /// <summary>Evaluates parts of the expression that don't change during user session on the server and returns client expression to be evaluated on client.</summary>
    ClientEvaluationResult<TResult> EvaluateForClient();

    /// <summary>Evaluates parts of the expression that don't change during user session on the server and returns client expression to be evaluated on client.</summary>
    Task<ClientEvaluationResult<TResult>> EvaluateForClientAsync(CancellationToken cancellationToken);

    /// <summary>Evaluates parts of the expression that don't change during user session on the server and returns client expression to be evaluated on client.</summary>
    Task<ClientEvaluationResult<TResult>> EvaluateForClientAsync(ExecutionMode mode);
}
