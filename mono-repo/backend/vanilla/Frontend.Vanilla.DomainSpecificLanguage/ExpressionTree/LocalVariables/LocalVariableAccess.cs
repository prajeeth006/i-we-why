using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Syntactical.Rules;

namespace Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.LocalVariables;

/// <summary>
/// Accesses value of local variable with particular name.
/// </summary>
internal sealed class LocalVariableAccess(DslType resultType, TrimmedRequiredString variableName) : ExpressionTreeBase<LocalVariableAccess>
{
    public override DslType ResultType { get; } = resultType.GuardNotVoid(nameof(resultType));
    public TrimmedRequiredString VariableName { get; } = variableName;

    public override Task<IExpressionTree> EvaluateAsync(EvaluationContext context)
    {
        var finalValue = context.LocalVariables[VariableName];

        return Task.FromResult(finalValue ?? (IExpressionTree)this);
    }

    public override string SerializeToClient()
        => VariableName;

    public override IEnumerable<IExpressionTree> GetChildren()
        => Array.Empty<IExpressionTree>();

    public override string ToString()
        => LocalVariableAccessRule.ToString(this);

    public override bool Equals(LocalVariableAccess? other)
        => other?.VariableName.Equals(VariableName) is true; // Type is insignificant b/c single type of a variable is enforced in entire expression

    public override int GetHashCode()
        => VariableName.GetHashCode();
}
