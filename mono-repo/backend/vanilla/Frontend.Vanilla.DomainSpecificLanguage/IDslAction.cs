using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.DomainSpecificLanguage;

/// <summary>
/// An action written in Vanilla domain specific language not specific to current context.
/// It's fully analyzed and prepared for evaluation according to current context.
/// </summary>
public interface IDslAction
{
    /// <summary>Gets the original string used to construct the action.</summary>
    RequiredString OriginalString { get; }

    /// <summary>Gets the metadata.</summary>
    DslExpressionMetadata Metadata { get; }

    /// <summary>Fully executes the action on server.</summary>
    void Execute();

    /// <summary>Fully executes the action on server.</summary>
    Task ExecuteAsync(CancellationToken cancellationToken);

    /// <summary>Fully executes the action on server.</summary>
    Task ExecuteAsync(ExecutionMode mode);

    /// <summary>Executes parts of the action that don't change during user session on the server and returns action script to be evaluated on client.</summary>
    string? ExecuteToClientScript();

    /// <summary>Evaluates parts of the action that don't change during user session on the server and returns action script to be evaluated on client.</summary>
    Task<string?> ExecuteToClientScriptAsync(CancellationToken cancellationToken);

    /// <summary>Evaluates parts of the action that don't change during user session on the server and returns action script to be evaluated on client.</summary>
    Task<string?> ExecuteToClientScriptAsync(ExecutionMode mode);
}
