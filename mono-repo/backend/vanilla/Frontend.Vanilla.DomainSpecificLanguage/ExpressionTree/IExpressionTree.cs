using System.Collections.Generic;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;

/// <summary>
/// Actual expression represented as syntax tree.
/// </summary>
internal interface IExpressionTree
{
    DslType ResultType { get; }
    Task<IExpressionTree> EvaluateAsync(EvaluationContext context);
    string SerializeToClient();
    IReadOnlyDictionary<TrimmedRequiredString, LocalVariableInfo> GetLocalVariableUsages();
    DslExpressionMetadata CreateMetadata();
    IEnumerable<IExpressionTree> GetChildren();
}

internal enum DslEvaluation
{
    FullOnServer,
    PartialForClient,
    Optimization,
}

internal struct LocalVariableInfo
{
    public DslType Type { get; }
    public bool IsAssigned { get; }
    public bool IsAccessed { get; }

    public LocalVariableInfo(DslType type, bool isAssigned, bool isAccessed)
    {
        Guard.Requires(isAssigned || isAccessed, nameof(isAssigned), "Variable must be assigned or accessed.");
        Type = type.GuardNotVoid(nameof(type));
        IsAssigned = isAssigned;
        IsAccessed = isAccessed;
    }
}
